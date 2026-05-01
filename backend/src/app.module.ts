import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { ApiKeyModule } from './apikey/apikey.module';
import { AuthModule } from './auth/auth.module';
import { DocumentsModule } from './documents/documents.module';
import { DossiersModule } from './dossiers/dossiers.module';
import { MailModule } from './mail/mail.module';
import { ProcedureModule } from './procedure/procedure.module';
import { PropertiesModule } from './properties/properties.module';
import { ProvincesModule } from './provinces/provinces.module';
import { PublicProcedureController } from './public-procedure/public-procedure.controller';
import { SupabaseModule } from './supabase/supabase.module';
import { UsersModule } from './users/users.module';
import { VehiclesModule } from './vehicles/vehicles.module';
import { RoomsModule } from './rooms/rooms.module';
import { MemberAssignationModule } from './member-assignation/member-assignation.module';
import { RestaurantModule } from './restaurant/restaurant.module';
import { AppController } from './app.controller';

@Module({
  imports: [
    PrismaModule,
    ApiKeyModule,
    AuthModule,
    DocumentsModule,
    DossiersModule,
    MailModule,
    ProcedureModule,
    PropertiesModule,
    ProvincesModule,
    SupabaseModule,
    UsersModule,
    VehiclesModule,
    RoomsModule,
    MemberAssignationModule,
    RestaurantModule,
  ],
  controllers: [PublicProcedureController, AppController],
})
export class AppModule {}
