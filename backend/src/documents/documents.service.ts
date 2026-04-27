import { Injectable } from '@nestjs/common';
import { GenerateDocumentDto, DocumentCategory } from './dto/generate-document.dto';

@Injectable()
export class DocumentsService {
  private formatDate(dateStr?: string): string {
    if (!dateStr) return '___________';
    return new Date(dateStr).toLocaleDateString('fr-CD', {
      day: '2-digit', 
      month: 'long', 
      year: 'numeric',
    });
  }

  private formatMontant(montant: number, devise: string): string {
    return `${montant.toLocaleString('fr-CD')} ${devise}`;
  }

  private entete(lieu: string, date: string, province = 'Kinshasa'): string {
    const refNum = `ZUW-${Date.now().toString().slice(-6)}`;
    const enregNum = Math.floor(Math.random() * 9999).toString().padStart(4, '0');
    const qrData = `ZUW:${refNum}:${enregNum}`; // Placeholder for QR

    return `
      <div class=\"header-container\">
        <div class=\"header-logo\">
          <img src=\"http://localhost:3002/logo.png\" alt=\"ZUWAndaku\" style=\"height: 80px; width: auto;\" />
          <div class=\"logo-text\">ZUWAndaku Immobilier & Véhicules</div>
        </div>
        <div class=\"entete\">
          <div class=\"republique\">
            <p class=\"rdc-title\">RÉPUBLIQUE DÉMOCRATIQUE DU CONGO</p>
            <p class=\"ministere-province\">Province de ${province} | Ministère des Affaires Foncières</p>
            <p class=\"ministere\">Direction des Biens et Propriétés Urbaines</p>
            <p class=\"devise\">« Justice - Paix - Travail »</p>
          </div>
          <div class=\"ref-qr\">
            <div class=\"qr-placeholder\" title=\"QR Verification: ${qrData}\">
              <!-- SVG QR Placeholder -->
              <svg width=\"80\" height=\"80\" viewBox=\"0 0 80 80\" style=\"background:#fff; border:2px solid #003087;\">
                <rect width=\"80\" height=\"80\" fill=\"#f0f0f0\"/>
                <rect x=\"10\" y=\"10\" width=\"20\" height=\"20\" fill=\"#003087\"/>
                <rect x=\"50\" y=\"10\" width=\"20\" height=\"20\" fill=\"#003087\"/>
                <rect x=\"10\" y=\"50\" width=\"20\" height=\"20\" fill=\"#003087\"/>
                <rect x=\"50\" y=\"50\" width=\"20\" height=\"20\" fill=\"#003087\"/>
                <text x=\"40\" y=\"75\" text-anchor=\"middle\" fill=\"#666\" font-size=\"8\">QR REF</text>
              </svg>
            </div>
            <div class=\"ref\">
              <p>Fait à <strong>${lieu}</strong>, le <strong>${date}</strong></p>
              <p><strong>Réf:</strong> ${refNum}</p>
              <p><strong>N° Enreg:</strong> ${enregNum}</p>
            </div>
          </div>
        </div>
        <div class=\"header-seal\">
          <div class=\"seal-placeholder\">
            <img src=\"http://localhost:3002/seal.png\" alt=\"Sceau Officiel\" style=\"height:60px;\" onerror=\"this.style.display='none';\"/>
            <div style=\"font-size:12px; color:#003087; text-align:center;\">Cachet Officiel</div>
          </div>
        </div>
      </div>
    `;
  }

  private tableOfContents(titre: string): string {
    return `
      <div class=\"toc-container\">
        <h3>Sommaire</h3>
        <ol class=\"toc-list\">
          <li>Parties Contractantes</li>
          <li>Objet du Contrat</li>
          <li>Durée et Prix</li>
          <li>Obligations des Parties</li>
          <li>Garanties et Responsabilités</li>
          <li>Résiliation et Litiges</li>
          <li>Dispositions Finales</li>
          <li>Signatures</li>
        </ol>
      </div>
    `;
  }

  private partiesTable(dto: GenerateDocumentDto, labelA: string, labelB: string): string {
    return `
      <table class=\"parties-table\">
        <thead>
          <tr><th colspan=\"2\">${labelA} / Partie A</th></tr>
        </thead>
        <tbody>
          <tr><td>Nom Complet</td><td>${dto.bailleurNom}</td></tr>
          <tr><td>N° CNI / Registre</td><td>${dto.bailleurCni}</td></tr>
          <tr><td>Adresse Complète</td><td>${dto.bailleurAdresse}</td></tr>
          <tr><td>Téléphone</td><td>___________</td></tr>
        </tbody>
      </table>
      <table class=\"parties-table\">
        <thead>
          <tr><th colspan=\"2\">${labelB} / Partie B</th></tr>
        </thead>
        <tbody>
          <tr><td>Nom Complet</td><td>${dto.locataireNom}</td></tr>
          <tr><td>N° CNI / Registre</td><td>${dto.locataireCni}</td></tr>
          <tr><td>Adresse Complète</td><td>${dto.locataireAdresse}</td></tr>
          <tr><td>Téléphone</td><td>___________</td></tr>
        </tbody>
      </table>
    `;
  }

  private signaturesTable(lieu: string, date: string): string {
    return `
      <table class=\"signatures-table\">
        <tr>
          <td>
            <div class=\"sig-header\">Partie A (Bailleur/Vendeur)</div>
            <div class=\"sig-line\">Nom: _______________________________</div>
            <div class=\"sig-box\"></div>
            <div>Lieu/Date: ${lieu}, ${date}</div>
          </td>
          <td>
            <div class=\"sig-header\">Partie B (Locataire/Acquéreur)</div>
            <div class=\"sig-line\">Nom: _______________________________</div>
            <div class=\"sig-box\"></div>
            <div>Lieu/Date: ${lieu}, ${date}</div>
          </td>
          <td>
            <div class=\"sig-header\">Témoin 1</div>
            <div class=\"sig-line\">Nom: _______________________________</div>
            <div class=\"sig-box\"></div>
            <div>Lieu/Date: ${lieu}, ${date}</div>
          </td>
        </tr>
        <tr>
          <td colspan=\"3\">
            <div class=\"sig-header\">Témoin 2 / Notaire (optionnel)</div>
            <div class=\"sig-line\">Nom: _______________________________</div>
            <div class=\"sig-box\"></div>
          </td>
        </tr>
      </table>
    `;
  }

  private legalFooter(): string {
    return `
      <div class=\"legal-footer\">
        <h4>Base Légale Complète</h4>
        <ul>
          <li>Loi n°73-021 du 20/07/1973 portant régime général des biens (Foncière)</li>
          <li>Loi n°80-008 du 18/07/1980 modifiant la Loi Foncière</li>
          <li>Décret-loi n°73-022 du 20/07/1973 (Véhicules)</li>
          <li>OHADA Acte Uniforme sur le Droit Commercial Général</li>
          <li>Code Civil Congolais - Dispositions sur les contrats</li>
        </ul>
        <p><strong>Enregistrement obligatoire</strong> au Bureau des Hypothèques/Titres dans 30 jours. Frais: 1-2% valeur transaction.</p>
        <p>Généré via ZUWAndaku © 2024 | Vérifiable via QR code ci-dessus</p>
      </div>
    `;
  }

  private enhancedCss(): string {
    return `
      <style>
        @import url('https://fonts.googleapis.com/css2?family=Roboto+Slab:wght@400;600;700&family=Open+Sans:wght@400;500;600&display=swap');
        
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { 
          font-family: 'Open Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; 
          font-size: 13px; 
          line-height: 1.65; 
          color: #1a1a1a; 
          background: linear-gradient(to bottom, #f8faff 0%, #ffffff 100%); 
          padding: 40px 30px; 
          max-width: 900px; 
          margin: auto; 
          position: relative;
        }
        h1 { 
          font-family: 'Roboto Slab', serif;
          font-size: 24px; 
          text-align: center; 
          text-transform: uppercase; 
          letter-spacing: 2px; 
          margin: 40px 0 20px; 
          padding: 20px 30px;
          background: linear-gradient(135deg, #002d5b, #004080);
          color: white;
          border-radius: 12px;
          box-shadow: 0 6px 20px rgba(0,45,91,0.25);
        }
        h2, h3, h4 { 
          font-family: 'Roboto Slab', serif;
          color: #002d5b; 
          border-left: 5px solid #004080; 
          padding: 12px 16px; 
          background: linear-gradient(90deg, #f0f7ff, #ffffff); 
          margin: 25px 0 15px;
        }
        h2 { font-size: 16px; text-transform: uppercase; }
        h3 { font-size: 14px; }
        h4 { font-size: 12px; }
        
        .header-container { margin-bottom: 35px; page-break-inside: avoid; }
        .header-logo { text-align: center; margin-bottom: 25px; }
        .logo-text { 
          font-family: 'Roboto Slab', serif;
          font-size: 28px; 
          font-weight: 700; 
          background: linear-gradient(135deg, #002d5b, #004080); 
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          margin-top: 10px; letter-spacing: 3px;
        }
        .entete { display: flex; justify-content: space-between; align-items: start; gap: 20px; padding: 25px 0; border-top: 3px solid #004080; border-bottom: 3px solid #004080; }
        .republique { flex: 1; text-align: center; }
        .rdc-title { font-family: 'Roboto Slab', serif; font-size: 18px; font-weight: 700; color: #002d5b; margin-bottom: 6px; letter-spacing: 1px; }
        .ministere-province { font-size: 13px; color: #333; font-weight: 500; margin-bottom: 4px; }
        .ministere { font-size: 12px; color: #555; }
        .devise { font-size: 11px; font-style: italic; color: #777; }
        .ref-qr { display: flex; flex-direction: column; align-items: end; gap: 10px; }
        .qr-placeholder { border: 2px solid #004080; border-radius: 8px; padding: 5px; background: white; }
        .ref { text-align: right; font-size: 11px; background: #f8f9ff; padding: 10px; border-radius: 6px; }
        .ref p { margin: 3px 0; font-weight: 500; }
        .header-seal { text-align: center; margin-top: 15px; }
        .seal-placeholder { display: inline-block; background: linear-gradient(135deg, #e3f2ff, #f5faff); border: 2px dashed #004080; border-radius: 50%; padding: 15px; width: 120px; height: 120px; }
        
        .toc-container { background: linear-gradient(135deg, #e8f4ff, #f0f8ff); border: 2px solid #b3d9ff; border-radius: 10px; padding: 20px; margin: 30px 0; }
        .toc-container h3 { margin-bottom: 15px; color: #002d5b; }
        .toc-list { list-style-position: inside; padding-left: 20px; }
        .toc-list li { margin: 5px 0; font-weight: 500; }
        
        table { width: 100%; border-collapse: collapse; margin: 20px 0; }
        .parties-table, .signatures-table { 
          background: white; 
          box-shadow: 0 4px 12px rgba(0,45,91,0.1); 
          border-radius: 10px; 
          overflow: hidden;
        }
        th { background: linear-gradient(135deg, #002d5b, #004080); color: white; padding: 12px 15px; text-align: left; font-weight: 600; }
        td { padding: 12px 15px; border-bottom: 1px solid #e0e7ff; vertical-align: top; }
        td:first-child { font-weight: 600; color: #002d5b; width: 35%; background: #f8faff; }
        
        .article { 
          margin: 20px 0; 
          padding: 20px; 
          background: white; 
          border: 2px solid #e3f2ff; 
          border-left: 6px solid #004080; 
          border-radius: 0 12px 12px 0; 
          box-shadow: 0 3px 10px rgba(0,45,91,0.08);
        }
        .article p, .article ul li { text-align: justify; margin: 10px 0; }
        .article ul { padding-left: 25px; }
        .article strong { color: #002d5b; }
        .montant-box { 
          display: inline-block; 
          background: linear-gradient(135deg, #002d5b, #004080); 
          color: white; 
          padding: 15px 25px; 
          border-radius: 10px; 
          font-size: 18px; 
          font-weight: 700; 
          font-family: 'Roboto Slab', serif;
          margin: 15px 0;
          box-shadow: 0 5px 15px rgba(0,45,91,0.3);
          letter-spacing: 1px;
        }
        .annexe { background: #fff8e1; border-left-color: #ffb300; }
        
        .signatures-table td { text-align: center; }
        .sig-header { font-weight: 700; color: #002d5b; margin-bottom: 10px; font-size: 12px; text-transform: uppercase; }
        .sig-line { margin: 8px 0; font-style: italic; }
        .sig-box { height: 70px; border: 2px dashed #999; border-radius: 6px; margin: 12px 0; background: #f9f9f9; }
        
        .legal-footer { 
          margin-top: 50px; 
          padding: 25px; 
          background: linear-gradient(135deg, #f5f5f5, #fafafa); 
          border: 3px solid #ddd; 
          border-radius: 12px; 
          font-size: 11px; 
          color: #555;
        }
        .legal-footer h4 { color: #002d5b; margin-bottom: 12px; border-bottom: 2px solid #004080; padding-bottom: 8px; }
        .legal-footer ul { margin: 10px 0; padding-left: 20px; }
        .legal-footer li { margin: 4px 0; }
        .legal-footer p { margin: 8px 0; font-weight: 500; }
        
        .watermark { 
          position: fixed; 
          top: 20%; 
          left: 10%; 
          transform: translate(-50%, -50%) rotate(-35deg); 
          font-size: 140px; 
          color: rgba(0,45,91,0.025); 
          font-weight: 900; 
          font-family: 'Roboto Slab', serif;
          letter-spacing: 5px;
          pointer-events: none; 
          z-index: -1;
          text-shadow: 0 0 20px rgba(0,45,91,0.1);
        }
        .watermark::after {
          content: '';
          position: absolute;
          top: 0; left: 0; right: 0; bottom: 0;
          background: linear-gradient(45deg, transparent 48%, rgba(0,45,91,0.02) 50%, transparent 52%);
          transform: rotate(90deg);
        }
        
        .important-box {
          background: linear-gradient(135deg, #d4edda, #e8f5e8);
          border: 2px solid #28a745;
          border-radius: 10px;
          padding: 20px;
          margin: 20px 0;
        }
        
        @media print { 
          body { padding: 20px; background: white !important; }
          .watermark { opacity: 0.08; transform: scale(0.9); }
          table { page-break-inside: avoid; }
          .header-container, .article, .toc-container { page-break-inside: avoid; }
        }
        @media (max-width: 768px) {
          .entete { flex-direction: column; text-align: center; }
          table { font-size: 12px; }
        }
      </style>
    `;
  }

  generate(dto: GenerateDocumentDto): string {
    const today = this.formatDate(new Date().toISOString());
    const dateDebut = this.formatDate(dto.dateDebut);
    const dateFin = this.formatDate(dto.dateFin);
    const montant = this.formatMontant(dto.montant, dto.devise);
    const lieu = dto.lieuSignature || 'Kinshasa';
    const province = 'Province de ' + (dto.lieuSignature ? dto.lieuSignature.split(',')[1]?.trim() || 'Kinshasa' : 'Kinshasa');

    let titre = '';
    let corps = '';
    let parties = '';
    let signaturesLabelA = '';
    let signaturesLabelB = '';

    switch (dto.category) {
      case DocumentCategory.CONTRAT_LOCATION_BIEN:
        titre = 'CONTRAT DE BAIL À USAGE RÉSIDENTIEL / COMMERCIAL';
        signaturesLabelA = 'Le Bailleur';
        signaturesLabelB = 'Le Locataire';
        parties = this.partiesTable(dto, 'Le Bailleur', 'Le Locataire');
        corps = `
          <div class="toc-container">${this.tableOfContents(titre)}</div>
          ${parties}
          
          <h2>Article 1 - Définitions et Objet</h2>
          <div class="article">
            <p>Le Bailleur donne en location au Locataire le bien immobilier sis à <strong>${dto.bienAdresse || 'À préciser'}</strong>, constituant ${dto.bienDescription || 'appartement/local commercial'}</p>
            <p class="important-box"><strong>Description précise:</strong> Surface: ___ m² | Étages: ___ | État: habitable/meublé</p>
          </div>
          
          <h2>Article 2 - Durée et Renouvellement</h2>
          <div class="article">
            <p>Durée ferme: <strong>${dateDebut}</strong> au <strong>${dateFin}</strong> (${Math.round((new Date(dto.dateFin || '').getTime() - new Date(dto.dateDebut || '').getTime()) / (1000*60*60*24))} jours)</p>
            <p>Renouvellement tacitement pour périodes identiques, sauf préavis 3 mois.</p>
          </div>
          
          <h2>Article 3 - Loyer et Charges</h2>
          <div class="article">
            <p>Loyer mensuel: <span class="montant-box">${montant}</span></p>
            <p>Indexation annuelle CPI | Charges récupérables: eau/électricité ___ FC</p>
          </div>
          
          <h2>Article 4 - Obligations du Locataire</h2>
          <div class="article">
            <ul>
              <li>Payer loyer 1er du mois, déchéance automatique après 15 jours</li>
              <li>Entretenir en bon père de famille, réparations locatives à sa charge</li>
              <li>Assurance habitation obligatoire</li>
              <li>Interdiction sous-location sans accord écrit</li>
              <li>État des lieux entrée/sortie</li>
            </ul>
          </div>
          
          <h2>Article 5 - Obligations du Bailleur</h2>
          <div class="article">
            <ul>
              <li>Délivrer bien habitable (toit, électricité, eau)</li>
              <li>Réparations structurelles (gros œuvre)</li>
              <li>Jouissance paisible</li>
            </ul>
          </div>
          
          <h2>Article 6 - Garanties et Caution</h2>
          <div class="article">
            <p>Caution: 2 mois de loyer | Décompte préalable à restitution</p>
          </div>
          
          <h2>Article 7 - Résiliation et Expulsion</h2>
          <div class="article">
            <p>Non-paiement >60 jours: résiliation judiciaire | Congé pour vente: préavis 6 mois</p>
          </div>
          
          <h2>Article 8 - Force Majeure et Litiges</h2>
          <div class="article">
            <p>Force majeure: guerre, catastrophe | Litiges: Tribunal de ${lieu}</p>
          </div>
          
          <h2>Article 9 - Annexes</h2>
          <div class="article annexe">
            <p>Plan cadastral | Photos | État des lieux | Assurance</p>
          </div>
        `;
        break;

      // CONTRAT_VENTE_BIEN - Expanded similarly
      case DocumentCategory.CONTRAT_VENTE_BIEN:
        titre = 'ACTE DE VENTE IMMOBILIÈRE SOUS SEING PRIVÉ';
        signaturesLabelA = 'Le Vendeur';
        signaturesLabelB = "L'Acquéreur";
        parties = this.partiesTable(dto, 'Le Vendeur', "L'Acquéreur");
        corps = `
          <div class="toc-container">${this.tableOfContents(titre)}</div>
          ${parties}
          
          <h2>Article 1 - Objet de la Vente</h2>
          <div class="article">
            <p>Vente du bien sis <strong>${dto.bienAdresse}</strong>: ${dto.bienDescription}, libre charges/hypothèques</p>
            <p>Attestation propriété n°___ délivrée le ___</p>
          </div>
          
          <h2>Article 2 - Prix et Modalités</h2>
          <div class="article">
            <p>Prix: <span class="montant-box">${montant}</span> | Payé comptant, quittance donnée</p>
            <p>${dto.montant > 10000000 ? 'Àcertains notariés obligatoires pour >50.000$' : 'Vente sous seing privé valide'}</p>
          </div>
          
          <h2>Article 3 - Transfert Propriété</h2>
          <div class="article">
            <p>Propriété transférée dès signature/paiement | Possession immédiate</p>
          </div>
          
          <h2>Article 4 - Garanties Légales</h2>
          <div class="article">
            <ul>
              <li>Garantie éviction complète (art. 1626 Code Civil)</li>
              <li>Vices cachés 6 mois (infiltrations, structure)</li>
              <li>Sanité: certificat urbanisme joint</li>
            </ul>
          </div>
          
          <h2>Article 5 - Frais et Taxes</h2>
          <div class="article">
            <p>Acquéreur: droits mutation 2% | Enregistrement 1% | Vendeur: plus-value taxable</p>
          </div>
          
          <h2>Article 6 - Mutation Titre</h2>
          <div class="article">
            <p>Mutation au BTIT dans 60 jours | Immatriculation Expéditive</p>
          </div>
          
          <h2>Article 7 - Résolution et Litiges</h2>
          <div class="article">
            <p>Clause résolutoire automatique non-paiement solde | Tribunal ${lieu}</p>
          </div>
          
          <h2>Article 8 - Annexes</h2>
          <div class="article annexe">
            <p>Titre foncier | PV bornage | Diagnostics techniques | Photos</p>
          </div>
        `;
        break;

      case DocumentCategory.CONTRAT_LOCATION_VEHICULE:
        titre = 'CONTRAT DE LOCATION COURTE DURÉE VÉHICULE';
        signaturesLabelA = 'Le Loueur';
        signaturesLabelB = 'Le Locataire';
        parties = this.partiesTable(dto, 'Le Loueur', 'Le Locataire');
        corps = `
          <div class="toc-container">${this.tableOfContents(titre)}</div>
          ${parties}
          <h2>Article 1 - Véhicule Loué</h2>
          <div class="article">
            <table><tr><td>Marque</td><td>${dto.vehiculeMarque || 'À préciser'}</td></tr>
            <tr><td>Modèle</td><td>${dto.vehiculeModele}</td></tr>
            <tr><td>Immatriculation</td><td>${dto.vehiculePlaque}</td></tr>
            <tr><td>Km compteur</td><td>______ km</td></tr></table>
          </div>
          <h2>Article 2 - Durée et Tarif</h2>
          <div class="article">
            <p>Du ${dateDebut} au ${dateFin} | Tarif journalier <span class="montant-box">${montant}</span></p>
          </div>
          <!-- Add more articles: obligations, assurance, sinistres, etc. -->
          <h2>Article 3 - Assurance et Franchise</h2>
          <div class="article">
            <p>RC + tous risques incluse | Franchise 500.000 FC en cas sinistre</p>
          </div>
          <h2>Article 4 - Interdictions</h2>
          <div class="article">
            <ul><li>Conduite permit >2 ans requis</li><li>Pas course/rallye</li><li>Max ___ km/jour</li></ul>
          </div>
          <!-- ... expand to 8+ articles ... -->
        `;
        break;

      // Similarly expand other categories with more content...
      case DocumentCategory.CONTRAT_VENTE_VEHICULE:
        titre = 'ACTE DE CESSION VÉHICULE AUTOMOBILE';
        signaturesLabelA = 'Le Vendeur';
        signaturesLabelB = "L'Acquéreur";
        parties = this.partiesTable(dto, 'Le Vendeur', "L'Acquéreur");
        corps = `
          <div class="toc-container">${this.tableOfContents(titre)}</div>
          ${parties}

          <h2>Article 1 - Identification du Véhicule</h2>
          <div class="article">
            <table>
              <tr><td>Marque / Modèle</td><td>${dto.vehiculeMarque || '___'} ${dto.vehiculeModele || '___'}</td></tr>
              <tr><td>Plaque d'immatriculation</td><td>${dto.vehiculePlaque || '___'}</td></tr>
              <tr><td>Numéro de châssis (VIN)</td><td>___________________________</td></tr>
              <tr><td>Numéro moteur</td><td>___________________________</td></tr>
              <tr><td>Couleur / Année</td><td>___________ / ___________</td></tr>
              <tr><td>Kilométrage au compteur</td><td>___________ km</td></tr>
              <tr><td>Carburant</td><td>Essence ☐  Diesel ☐  Hybride ☐</td></tr>
            </table>
          </div>

          <h2>Article 2 - Prix de Cession</h2>
          <div class="article">
            <p>Prix convenu et accepté: <span class="montant-box">${montant}</span></p>
            <p>Modalités: Comptant ☐  Virement ☐  Versements ☐ (échéancier joint)</p>
            <p>Acompte versé: ___________ | Solde dû le: ___________</p>
          </div>

          <h2>Article 3 - Transfert de Propriété</h2>
          <div class="article">
            <p>La propriété du véhicule est transférée à l'Acquéreur à compter du <strong>${dateDebut || today}</strong>, après paiement intégral du prix.</p>
            <p>Remise des clés, carte grise et documents de bord effectuée simultanément.</p>
          </div>

          <h2>Article 4 - État du Véhicule et Garanties</h2>
          <div class="article">
            <ul>
              <li>Vendu en l'état, après inspection contradictoire (PV joint)</li>
              <li>Garantie vices cachés: 3 mois à compter de la livraison</li>
              <li>Vendeur certifie: absence de gage, saisie, opposition ou crédit non soldé</li>
              <li>Contrôle technique valide: ☐ Oui (date: ___) ☐ Non</li>
            </ul>
          </div>

          <h2>Article 5 - Obligations de l'Acquéreur</h2>
          <div class="article">
            <ul>
              <li>Procéder au changement de carte grise dans les <strong>30 jours</strong> auprès de la DGRK/DVDA</li>
              <li>Souscrire une assurance RC avant toute mise en circulation</li>
              <li>Régler les taxes de mutation et frais d'immatriculation</li>
            </ul>
          </div>

          <h2>Article 6 - Responsabilités Post-Cession</h2>
          <div class="article">
            <p>Tout accident, infraction ou dommage survenu après la date de cession est à la charge exclusive de l'Acquéreur.</p>
            <p>Le Vendeur est déchargé de toute responsabilité dès remise des documents.</p>
          </div>

          <h2>Article 7 - Résolution et Litiges</h2>
          <div class="article">
            <p>Non-paiement du solde dans les délais: résolution automatique, restitution du véhicule sans indemnité.</p>
            <p>Tout litige sera soumis au Tribunal de Grande Instance de <strong>${lieu}</strong>.</p>
          </div>

          <h2>Article 8 - Annexes</h2>
          <div class="article annexe">
            <p>☐ Carte grise originale  ☐ Carnet d'entretien  ☐ PV inspection  ☐ Quittance assurance  ☐ Photos véhicule</p>
          </div>
        `;
        break;

      case DocumentCategory.RECU_PAIEMENT:
        titre = 'QUITTANCE DE PAIEMENT — REÇU DÉFINITIF';
        signaturesLabelA = 'Le Créancier / Bailleur';
        signaturesLabelB = 'Le Débiteur / Locataire';
        parties = this.partiesTable(dto, 'Le Créancier', 'Le Débiteur');
        corps = `
          ${parties}

          <h2>Détail du Paiement Reçu</h2>
          <div class="article">
            <table>
              <tr><td>Objet du paiement</td><td>${dto.bienDescription || dto.vehiculeModele || 'Loyer / Acompte / Solde'}</td></tr>
              <tr><td>Bien / Véhicule concerné</td><td>${dto.bienAdresse || dto.vehiculePlaque || '___________'}</td></tr>
              <tr><td>Période couverte</td><td>${dateDebut} → ${dateFin}</td></tr>
              <tr><td>Montant reçu</td><td><strong>${montant}</strong></td></tr>
              <tr><td>Mode de paiement</td><td>Espèces ☐  Mobile Money ☐  Virement ☐  Chèque ☐</td></tr>
              <tr><td>Référence transaction</td><td>___________________________</td></tr>
              <tr><td>Date de réception</td><td>${today}</td></tr>
            </table>
          </div>

          <h2>Déclaration du Créancier</h2>
          <div class="article">
            <p>Je soussigné(e) <strong>${dto.bailleurNom}</strong>, CNI n° <strong>${dto.bailleurCni}</strong>, déclare avoir reçu de <strong>${dto.locataireNom}</strong> la somme de <span class="montant-box">${montant}</span> en règlement de l'obligation susmentionnée.</p>
            <p>Ce reçu vaut quittance définitive et libère le débiteur de toute obligation pour la période et le montant indiqués.</p>
          </div>

          <h2>Solde et Récapitulatif</h2>
          <div class="article">
            <table>
              <tr><td>Total dû</td><td>___________</td></tr>
              <tr><td>Déjà payé (cumul)</td><td>___________</td></tr>
              <tr><td>Présent paiement</td><td><strong>${montant}</strong></td></tr>
              <tr><td>Solde restant</td><td>___________</td></tr>
            </table>
          </div>

          <h2>Validité Légale</h2>
          <div class="article">
            <p>Ce document constitue une preuve de paiement opposable aux tiers conformément au Code Civil Congolais (art. 1234 et suivants).</p>
            <p>Toute contestation doit être formulée par écrit dans les <strong>15 jours</strong> suivant la date d'émission.</p>
          </div>
        `;
        break;

      case DocumentCategory.MISE_EN_DEMEURE:
        titre = 'MISE EN DEMEURE — LETTRE RECOMMANDÉE';
        signaturesLabelA = 'Le Créancier / Requérant';
        signaturesLabelB = 'Le Débiteur / Destinataire';
        parties = this.partiesTable(dto, 'Le Créancier (Expéditeur)', 'Le Débiteur (Destinataire)');
        corps = `
          ${parties}

          <h2>Objet de la Mise en Demeure</h2>
          <div class="article">
            <p>Par la présente, <strong>${dto.bailleurNom}</strong> met formellement en demeure <strong>${dto.locataireNom}</strong> de s'acquitter de ses obligations contractuelles dans les délais impartis.</p>
            <table>
              <tr><td>Nature de l'obligation</td><td>${dto.bienDescription || 'Loyer impayé / Obligation contractuelle'}</td></tr>
              <tr><td>Bien / Contrat concerné</td><td>${dto.bienAdresse || dto.vehiculePlaque || '___________'}</td></tr>
              <tr><td>Montant réclamé</td><td><strong>${montant}</strong></td></tr>
              <tr><td>Période de défaillance</td><td>${dateDebut} → ${dateFin}</td></tr>
              <tr><td>Délai accordé</td><td><strong>15 jours</strong> à compter de la réception</td></tr>
            </table>
          </div>

          <h2>Rappel des Faits</h2>
          <div class="article">
            <p>Malgré les relances amiables effectuées les ___________ et ___________, le débiteur n'a pas honoré ses engagements contractuels.</p>
            <p>Le contrat signé le ___________ prévoit expressément le paiement de <strong>${montant}</strong> à échéance du ___________.</p>
          </div>

          <h2>Injonction Formelle</h2>
          <div class="article">
            <p>En conséquence, il vous est <strong>formellement enjoint</strong> de:</p>
            <ul>
              <li>Régler la somme de <strong>${montant}</strong> dans un délai de <strong>15 jours</strong></li>
              <li>Libérer les lieux / restituer le bien si applicable</li>
              <li>Prendre contact avec le créancier pour convenir d'un arrangement</li>
            </ul>
          </div>

          <h2>Conséquences du Défaut</h2>
          <div class="article">
            <p>À défaut de règlement dans le délai imparti, le créancier se réserve le droit de:</p>
            <ul>
              <li>Saisir le Tribunal de Grande Instance de <strong>${lieu}</strong> en référé d'urgence</li>
              <li>Réclamer des dommages-intérêts et pénalités de retard (1,5%/mois)</li>
              <li>Procéder à la résiliation judiciaire du contrat</li>
              <li>Engager une procédure d'expulsion / saisie-exécution</li>
            </ul>
          </div>

          <h2>Base Légale</h2>
          <div class="article">
            <p>Conformément aux articles 1139, 1146 et 1382 du Code Civil Congolais, la présente mise en demeure fait courir les intérêts moratoires et constitue le point de départ du délai de prescription.</p>
          </div>
        `;
        break;

      case DocumentCategory.CERTIFICAT_IMMATRICULATION:
        titre = 'CERTIFICAT D\'IMMATRICULATION FONCIÈRE';
        signaturesLabelA = 'L\'Autorité Émettrice';
        signaturesLabelB = 'Le Propriétaire';
        parties = this.partiesTable(dto, 'Autorité Foncière (Émetteur)', 'Le Propriétaire Enregistré');
        corps = `
          ${parties}

          <h2>Identification du Bien Immatriculé</h2>
          <div class="article">
            <table>
              <tr><td>Adresse complète</td><td>${dto.bienAdresse || '___________'}</td></tr>
              <tr><td>Description</td><td>${dto.bienDescription || '___________'}</td></tr>
              <tr><td>Superficie totale</td><td>___________ m²</td></tr>
              <tr><td>Numéro de parcelle</td><td>___________________________</td></tr>
              <tr><td>Numéro de titre foncier</td><td>TF-KIN-___________</td></tr>
              <tr><td>Numéro cadastral</td><td>CAD-___________</td></tr>
              <tr><td>Zone / Quartier</td><td>___________</td></tr>
              <tr><td>Commune</td><td>___________</td></tr>
            </table>
          </div>

          <h2>Données du Propriétaire</h2>
          <div class="article">
            <table>
              <tr><td>Nom complet</td><td>${dto.bailleurNom}</td></tr>
              <tr><td>N° CNI</td><td>${dto.bailleurCni}</td></tr>
              <tr><td>Adresse</td><td>${dto.bailleurAdresse}</td></tr>
              <tr><td>Mode d'acquisition</td><td>Achat ☐  Héritage ☐  Donation ☐  Attribution ☐</td></tr>
              <tr><td>Date d'acquisition</td><td>${dateDebut}</td></tr>
              <tr><td>Valeur déclarée</td><td>${montant}</td></tr>
            </table>
          </div>

          <h2>Charges et Servitudes</h2>
          <div class="article">
            <p>Hypothèques: Néant ☐  Oui (détail: ___________)</p>
            <p>Servitudes: Passage ☐  Vue ☐  Égout ☐  Néant ☐</p>
            <p>Restrictions urbanistiques: ___________</p>
          </div>

          <h2>Attestation de l'Autorité</h2>
          <div class="article">
            <p>Le Conservateur des Titres Immobiliers de la Province de <strong>${lieu}</strong> certifie que le bien susmentionné est régulièrement immatriculé au registre foncier sous le numéro <strong>TF-KIN-___________</strong>.</p>
            <p>Ce certificat est valable <strong>6 mois</strong> à compter de la date d'émission.</p>
            <p>Émis le: <strong>${today}</strong> | Valable jusqu'au: ___________</p>
          </div>
        `;
        break;

      case DocumentCategory.CNI_PROPRIETAIRE:
        titre = 'FICHE D\'IDENTIFICATION DU PROPRIÉTAIRE';
        signaturesLabelA = 'L\'Agent Vérificateur';
        signaturesLabelB = 'Le Propriétaire Déclarant';
        parties = this.partiesTable(dto, 'Agent ZUWAndaku (Vérificateur)', 'Le Propriétaire');
        corps = `
          <h2>Identité Civile</h2>
          <div class="article">
            <table>
              <tr><td>Nom et Prénom(s)</td><td>${dto.bailleurNom}</td></tr>
              <tr><td>N° CNI / Passeport</td><td>${dto.bailleurCni}</td></tr>
              <tr><td>Date de naissance</td><td>___________</td></tr>
              <tr><td>Lieu de naissance</td><td>___________</td></tr>
              <tr><td>Nationalité</td><td>Congolaise ☐  Autre: ___________</td></tr>
              <tr><td>Situation matrimoniale</td><td>Célibataire ☐  Marié(e) ☐  Divorcé(e) ☐  Veuf/ve ☐</td></tr>
              <tr><td>Profession</td><td>___________</td></tr>
              <tr><td>Employeur / Entreprise</td><td>___________</td></tr>
            </table>
          </div>

          <h2>Coordonnées</h2>
          <div class="article">
            <table>
              <tr><td>Adresse résidentielle</td><td>${dto.bailleurAdresse}</td></tr>
              <tr><td>Téléphone principal</td><td>___________</td></tr>
              <tr><td>Téléphone secondaire</td><td>___________</td></tr>
              <tr><td>Email</td><td>___________</td></tr>
            </table>
          </div>

          <h2>Patrimoine Déclaré</h2>
          <div class="article">
            <table>
              <tr><td>Bien(s) immobilier(s)</td><td>${dto.bienAdresse || '___________'}</td></tr>
              <tr><td>Description</td><td>${dto.bienDescription || '___________'}</td></tr>
              <tr><td>Valeur estimée</td><td>${montant}</td></tr>
              <tr><td>Titre foncier n°</td><td>___________</td></tr>
              <tr><td>Véhicule(s)</td><td>${dto.vehiculeMarque || '___'} ${dto.vehiculeModele || ''} — ${dto.vehiculePlaque || '___'}</td></tr>
            </table>
          </div>

          <h2>Documents Fournis</h2>
          <div class="article">
            <p>☐ CNI originale vérifiée  ☐ Titre foncier  ☐ Acte de naissance  ☐ Justificatif domicile  ☐ Photo d'identité</p>
          </div>

          <h2>Déclaration sur l'Honneur</h2>
          <div class="article">
            <p>Je soussigné(e) <strong>${dto.bailleurNom}</strong> certifie sur l'honneur l'exactitude des informations fournies et m'engage à notifier ZUWAndaku de tout changement dans un délai de <strong>30 jours</strong>.</p>
            <p>Toute fausse déclaration engage ma responsabilité pénale (art. 124 Code Pénal Congolais).</p>
          </div>
        `;
        break;

      case DocumentCategory.LICENCE_PROFESSIONNELLE:
        titre = 'LICENCE PROFESSIONNELLE — AGENT IMMOBILIER / VÉHICULES';
        signaturesLabelA = 'ZUWAndaku (Autorité Émettrice)';
        signaturesLabelB = "L'Agent Licencié";
        parties = this.partiesTable(dto, 'ZUWAndaku (Émetteur)', "L'Agent Professionnel");
        corps = `
          ${parties}

          <h2>Identification de l'Agent</h2>
          <div class="article">
            <table>
              <tr><td>Nom complet</td><td>${dto.bailleurNom}</td></tr>
              <tr><td>N° CNI</td><td>${dto.bailleurCni}</td></tr>
              <tr><td>Adresse professionnelle</td><td>${dto.bailleurAdresse}</td></tr>
              <tr><td>N° Licence</td><td>LIC-ZUW-___________</td></tr>
              <tr><td>Catégorie</td><td>Immobilier ☐  Véhicules ☐  Mixte ☐</td></tr>
              <tr><td>Zone d'exercice</td><td>${lieu} et environs</td></tr>
            </table>
          </div>

          <h2>Étendue de la Licence</h2>
          <div class="article">
            <p>La présente licence autorise son titulaire à exercer les activités suivantes sur la plateforme ZUWAndaku:</p>
            <ul>
              <li>Mise en location et vente de biens immobiliers (maisons, parcelles, appartements)</li>
              <li>Cession et location de véhicules automobiles</li>
              <li>Représentation de propriétaires dans les transactions</li>
              <li>Rédaction et signature de contrats au nom de ZUWAndaku</li>
            </ul>
          </div>

          <h2>Durée et Renouvellement</h2>
          <div class="article">
            <p>Valable du <strong>${dateDebut}</strong> au <strong>${dateFin}</strong> (1 an renouvelable).</p>
            <p>Renouvellement: dossier complet 60 jours avant expiration | Frais: ${montant}</p>
          </div>

          <h2>Obligations de l'Agent</h2>
          <div class="article">
            <ul>
              <li>Respecter le code de déontologie ZUWAndaku</li>
              <li>Commission maximale: 5% vente, 10% location (1 mois loyer)</li>
              <li>Déclaration mensuelle des transactions effectuées</li>
              <li>Formation continue: 20h/an minimum</li>
              <li>Interdiction de double représentation sans accord écrit des parties</li>
            </ul>
          </div>

          <h2>Sanctions et Révocation</h2>
          <div class="article">
            <p>Toute violation des obligations entraîne: avertissement → suspension 30 jours → révocation définitive.</p>
            <p>Recours: Comité de discipline ZUWAndaku dans les 15 jours.</p>
          </div>
        `;
        break;

      case DocumentCategory.PV_ASSEMBLEE:
        titre = 'PROCÈS-VERBAL D\'ASSEMBLÉE DE COPROPRIÉTAIRES';
        signaturesLabelA = 'Le Président de Séance';
        signaturesLabelB = 'Le Secrétaire';
        parties = this.partiesTable(dto, 'Le Président de Séance', 'Le Secrétaire de Séance');
        corps = `
          ${parties}

          <h2>Convocation et Quorum</h2>
          <div class="article">
            <table>
              <tr><td>Lieu de réunion</td><td>${dto.bienAdresse || lieu}</td></tr>
              <tr><td>Date et heure</td><td>${today} à ___ h ___</td></tr>
              <tr><td>Convocation envoyée le</td><td>${dateDebut}</td></tr>
              <tr><td>Nombre de copropriétaires</td><td>___ présents / ___ représentés / ___ absents</td></tr>
              <tr><td>Tantièmes représentés</td><td>___ / 1000 (____%)</td></tr>
              <tr><td>Quorum atteint</td><td>Oui ☐  Non ☐ (report au ___)</td></tr>
            </table>
          </div>

          <h2>Ordre du Jour</h2>
          <div class="article">
            <ol>
              <li>Approbation du procès-verbal de la dernière assemblée</li>
              <li>Présentation des comptes de l'exercice écoulé</li>
              <li>Vote du budget prévisionnel: <strong>${montant}</strong></li>
              <li>Travaux et entretien des parties communes</li>
              <li>Élection / renouvellement du syndic</li>
              <li>Questions diverses</li>
            </ol>
          </div>

          <h2>Délibérations et Votes</h2>
          <div class="article">
            <table>
              <tr><th>Résolution</th><th>Pour</th><th>Contre</th><th>Abstention</th><th>Résultat</th></tr>
              <tr><td>1. Approbation PV précédent</td><td>___</td><td>___</td><td>___</td><td>Adopté ☐ / Rejeté ☐</td></tr>
              <tr><td>2. Approbation comptes</td><td>___</td><td>___</td><td>___</td><td>Adopté ☐ / Rejeté ☐</td></tr>
              <tr><td>3. Budget ${montant}</td><td>___</td><td>___</td><td>___</td><td>Adopté ☐ / Rejeté ☐</td></tr>
              <tr><td>4. Travaux parties communes</td><td>___</td><td>___</td><td>___</td><td>Adopté ☐ / Rejeté ☐</td></tr>
              <tr><td>5. Élection syndic</td><td>___</td><td>___</td><td>___</td><td>Adopté ☐ / Rejeté ☐</td></tr>
            </table>
          </div>

          <h2>Résumé des Décisions</h2>
          <div class="article">
            <p>L'assemblée a approuvé un budget de <strong>${montant}</strong> pour l'exercice ${new Date().getFullYear() + 1}.</p>
            <p>Syndic élu/reconduit: <strong>${dto.bailleurNom}</strong> pour une durée de ___ an(s).</p>
            <p>Prochaine assemblée ordinaire prévue le: ___________</p>
          </div>

          <h2>Clôture</h2>
          <div class="article">
            <p>La séance est levée à ___ h ___ après épuisement de l'ordre du jour.</p>
            <p>Le présent PV sera notifié à tous les copropriétaires dans les <strong>8 jours</strong> et déposé au registre de la copropriété.</p>
          </div>
        `;
        break;

      default:
        titre = 'DOCUMENT OFFICIEL ZUWAndaku';
        corps = '<div class="article"><p>Template enrichi généré.</p></div>';
    }

    return `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${titre}</title>
  ${this.enhancedCss()}
</head>
<body>
  <div class="watermark">DOCUMENT OFFICIEL<br>ZUWANDAKU</div>
  ${this.entete(lieu, today, province)}
  <h1>${titre}</h1>
  ${corps}
  ${this.signaturesTable(lieu, today)}
  ${this.legalFooter()}
</body>
</html>`;
  }
}

