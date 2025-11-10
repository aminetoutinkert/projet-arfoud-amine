# 📄 CDC Section II : Périmètre Fonctionnel (Le Produit)

## II.1. Définition des Offres

| Caractéristique | Offre Standard (Moteur de Réservation) | Offre Luxe (Voyages Sur-Mesure) |
| :--- | :--- | :--- |
| **Modèle** | Réservation instantanée (Viator-like). | Demande de devis (Lead Generation) et gestion de projet personnalisée. |
| **Nature** | Excursions, activités simples, billets. | Circuits privés, hébergements haut de gamme, transport privé. |
| **Transaction** | Paiement en ligne immédiat. | Demande de devis, acompte, paiement final manuel. |
| **Clientèle** | Touristes individuels, Budget moyen. | Particuliers fortunés, Agences B2B. |

## II.2. Périmètre Fonctionnel Détaillé (MVP)

### A. Espace Client (Frontend/Public)
* Recherche & Filtrage Avancé.
* Page Produit Détaillée (Infos, Prix, Avis, Galerie).
* Panier & Checkout (Paiement sécurisé).
* Espace Personnel (Historique, Profil).
* **Formulaire Luxe** (Capture détaillée des besoins sur-mesure).

### B. Espace Partenaire (Backend/Interface Pro)
* Création et Gestion des Produits/Offres.
* Gestion des Réservations (Calendrier, Statut).
* Gestion des Paiements/Facturation (Commissions).
* Messagerie simplifiée (pour le suivi client).

### C. Espace Administration (Backend/Gestion Arfoud)
* Gestion Utilisateurs/Partenaires (Validation).
* Gestion des Contenus Statiques (Pages, Catégories).
* Tableau de Bord (Statistiques Clés).
* Suivi des Demandes Luxe (Attribution de leads).

## II.3. Modèle Économique

* **Standard :** Commission sur la vente (X%). Implémentation via API de paiement à frais de transaction (ex: Stripe/Paypal - *sans abonnement*).
* **Luxe :** Frais de service ou marge sur devis. Suivi manuel/CRM Open Source léger.
