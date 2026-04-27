import { Injectable, ForbiddenException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { MailService } from '../mail/mail.service';
import { LoginDto, RegisterDto, ForgotPasswordDto, VerifyOtpDto, ResetPasswordDto } from './dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private usersService: UsersService,
    private mailService: MailService,
  ) {}

  async login(dto: LoginDto) {
    const user = await this.usersService.findOne({ email: dto.email });
    if (!user) throw new ForbiddenException('Email ou mot de passe incorrect');

    const pwMatches = await bcrypt.compare(dto.password, user.password);
    if (!pwMatches) throw new ForbiddenException('Email ou mot de passe incorrect');

    const { password, ...safeUser } = user;
    return this.signToken(safeUser);
  }

  async register(dto: RegisterDto) {
    const existing = await this.usersService.findOne({ email: dto.email });
    if (existing) throw new ForbiddenException('Cet email est déjà utilisé');

    const hashedPassword = await bcrypt.hash(dto.password, 10);
    const user = await this.usersService.create({
      email: dto.email,
      password: hashedPassword,
      name: dto.name,
      role: dto.role,
      phone: dto.phone,
      address: dto.address,
      cni: dto.cni,
      siret: dto.siret,
      licenseNumber: dto.licenseNumber,
    });

    // Envoyer OTP de vérification email
    await this.sendEmailVerificationOtp(dto.email);

    const { password, ...safeUser } = user;
    return { ...this.signToken(safeUser), otpSent: true };
  }

  async sendEmailVerificationOtp(email: string) {
    await this.prisma.emailVerificationOtp.updateMany({
      where: { email, used: false },
      data: { used: true },
    });

    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

    await this.prisma.emailVerificationOtp.create({
      data: { email, code, expiresAt },
    });

    await this.mailService.sendMail({
      to: email,
      subject: 'ZUWAndaku – Vérification de votre email',
      html: `
        <div style="font-family:Arial,sans-serif;max-width:480px;margin:0 auto;background:#0a0f1e;color:#f0f4ff;border-radius:12px;overflow:hidden;">
          <div style="background:linear-gradient(135deg,#1d4ed8,#2563eb);padding:32px 24px;text-align:center;">
            <h1 style="margin:0;font-size:24px;font-weight:800;color:#fff;">ZUWAndaku</h1>
            <p style="margin:8px 0 0;color:rgba(255,255,255,0.7);font-size:14px;">Vérification de votre compte</p>
          </div>
          <div style="padding:32px 24px;">
            <p style="color:#6b7fa3;font-size:15px;margin:0 0 24px;">Bienvenue ! Confirmez votre email avec ce code. Il expire dans <strong style="color:#f0f4ff;">10 minutes</strong>.</p>
            <div style="background:#060d1a;border:1px solid #1e3a5f;border-radius:12px;padding:24px;text-align:center;margin-bottom:24px;">
              <span style="font-size:42px;font-weight:900;letter-spacing:12px;color:#3b82f6;">${code}</span>
            </div>
            <p style="color:#6b7fa3;font-size:13px;margin:0;">Si vous n'avez pas créé ce compte, ignorez cet email.</p>
          </div>
          <div style="padding:16px 24px;border-top:1px solid #1e3a5f;text-align:center;">
            <p style="color:#6b7fa3;font-size:12px;margin:0;">© ${new Date().getFullYear()} ZUWAndaku SARL · Kinshasa, RDC</p>
          </div>
        </div>
      `,
    });
  }

  async verifyEmailOtp(dto: VerifyOtpDto) {
    const otp = await this.prisma.emailVerificationOtp.findFirst({
      where: { email: dto.email, code: dto.code, used: false },
      orderBy: { createdAt: 'desc' },
    });

    if (!otp) throw new BadRequestException('Code invalide.');
    if (otp.expiresAt < new Date()) throw new BadRequestException('Code expiré.');

    await this.prisma.emailVerificationOtp.update({
      where: { id: otp.id },
      data: { used: true },
    });

    return { verified: true };
  }

  async forgotPassword(dto: ForgotPasswordDto) {
    const user = await this.usersService.findOne({ email: dto.email });
    // On ne révèle pas si l'email existe ou non (sécurité)
    if (!user) return { message: 'Si cet email existe, un code a été envoyé.' };

    // Invalider les anciens OTPs
    await this.prisma.passwordResetOtp.updateMany({
      where: { email: dto.email, used: false },
      data: { used: true },
    });

    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    await this.prisma.passwordResetOtp.create({
      data: { email: dto.email, code, expiresAt },
    });

    await this.mailService.sendMail({
      to: dto.email,
      subject: 'ZUWAndaku – Code de réinitialisation',
      html: `
        <div style="font-family:Arial,sans-serif;max-width:480px;margin:0 auto;background:#0a0f1e;color:#f0f4ff;border-radius:12px;overflow:hidden;">
          <div style="background:linear-gradient(135deg,#1d4ed8,#2563eb);padding:32px 24px;text-align:center;">
            <h1 style="margin:0;font-size:24px;font-weight:800;color:#fff;">ZUWAndaku</h1>
            <p style="margin:8px 0 0;color:rgba(255,255,255,0.7);font-size:14px;">Réinitialisation de mot de passe</p>
          </div>
          <div style="padding:32px 24px;">
            <p style="color:#6b7fa3;font-size:15px;margin:0 0 24px;">Voici votre code de vérification à usage unique. Il expire dans <strong style="color:#f0f4ff;">10 minutes</strong>.</p>
            <div style="background:#060d1a;border:1px solid #1e3a5f;border-radius:12px;padding:24px;text-align:center;margin-bottom:24px;">
              <span style="font-size:42px;font-weight:900;letter-spacing:12px;color:#3b82f6;">${code}</span>
            </div>
            <p style="color:#6b7fa3;font-size:13px;margin:0;">Si vous n'avez pas demandé cette réinitialisation, ignorez cet email. Votre mot de passe reste inchangé.</p>
          </div>
          <div style="padding:16px 24px;border-top:1px solid #1e3a5f;text-align:center;">
            <p style="color:#6b7fa3;font-size:12px;margin:0;">© ${new Date().getFullYear()} ZUWAndaku SARL · Kinshasa, RDC</p>
          </div>
        </div>
      `,
    });

    return { message: 'Si cet email existe, un code a été envoyé.' };
  }

  async verifyOtp(dto: VerifyOtpDto) {
    const otp = await this.prisma.passwordResetOtp.findFirst({
      where: { email: dto.email, code: dto.code, used: false },
      orderBy: { createdAt: 'desc' },
    });

    if (!otp) throw new BadRequestException('Code invalide.');
    if (otp.expiresAt < new Date()) throw new BadRequestException('Code expiré. Veuillez en demander un nouveau.');

    return { valid: true };
  }

  async resetPassword(dto: ResetPasswordDto) {
    const otp = await this.prisma.passwordResetOtp.findFirst({
      where: { email: dto.email, code: dto.code, used: false },
      orderBy: { createdAt: 'desc' },
    });

    if (!otp) throw new BadRequestException('Code invalide.');
    if (otp.expiresAt < new Date()) throw new BadRequestException('Code expiré.');

    const hashed = await bcrypt.hash(dto.newPassword, 10);

    await this.prisma.user.update({
      where: { email: dto.email },
      data: { password: hashed },
    });

    await this.prisma.passwordResetOtp.update({
      where: { id: otp.id },
      data: { used: true },
    });

    return { message: 'Mot de passe réinitialisé avec succès.' };
  }

  async signToken(user: any): Promise<{ access_token: string; user: any }> {
    const payload = { sub: user.id, email: user.email, role: user.role };
    const token = await this.jwtService.signAsync(payload);
    return { access_token: token, user };
  }
}
