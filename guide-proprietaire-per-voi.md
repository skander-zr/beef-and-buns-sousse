# Guide propriétaire — Per Voi

## Objectif de la session

En 30 minutes, vous saurez consulter les nouvelles demandes, gérer les créneaux de tables, traiter une commande et masquer un plat indisponible. Le site public reste accessible à tous ; l’adresse `/hote` est réservée à l’équipe du restaurant.

## Avant de commencer

Préparez le compte administrateur qui vous a été attribué. Utilisez votre propre compte et ne partagez jamais un mot de passe personnel. Ouvrez le site puis ajoutez `/hote` à l’adresse. Sur la page de connexion, cliquez sur **Se connecter**. Si le compte est connecté mais n’a pas le rôle administrateur, contactez la personne qui gère le site.

## Parcours en 30 minutes

| Temps | À faire | Résultat attendu |
| --- | --- | --- |
| 0–5 min | Se connecter et repérer **Pilotage**, **Site public** et **Actualiser** | Vous savez revenir au site et rafraîchir les données. |
| 5–12 min | Ouvrir la section **Gérer les créneaux** et choisir une date | Vous voyez les 22 horaires de 12:00 à 22:30. |
| 12–17 min | Cliquer sur un créneau disponible pour le marquer complet, puis recliquer pour le rouvrir | Les clients ne voient plus un créneau complet ; l’état est persistant après actualisation. |
| 17–22 min | Lire une réservation et utiliser **Confirmer** ou **Refuser** | La demande change de statut et le compteur se met à jour. |
| 22–27 min | Ouvrir une commande, afficher ses articles, puis la faire progresser | Utilisez **Accepter**, **En préparation**, **Marquer prête**, puis **Terminer**. |
| 27–30 min | Ouvrir la section **Carte** et masquer un article temporairement | Le plat disparaît du menu public et peut être réactivé ensuite. |

## Gérer les tables et créneaux

La grille représente la capacité de réservation par horaire. Un créneau vert est disponible. Un créneau orange est complet. Un créneau gris est fermé. Le lundi est fermé automatiquement. Pour bloquer une heure exceptionnelle, cliquez sur un créneau disponible : il devient complet. Pour le rouvrir, cliquez à nouveau. Utilisez cette fonction lorsque la salle est complète, lorsqu’un événement privé occupe la salle ou lorsque l’équipe ne peut plus accepter de réservations.

Les réservations en attente apparaissent dans la colonne **Réservations**. Vérifiez le nom, l’heure, le nombre de personnes, le téléphone et la note. Confirmez uniquement lorsque la table est réellement disponible. Refusez une demande si elle ne peut pas être honorée, puis appelez le client si une alternative doit être proposée.

## Traiter une commande

Une nouvelle commande porte le statut **Nouvelle**. Ouvrez **Voir les articles** pour vérifier les quantités et le total. Appelez le numéro du client si une précision est nécessaire. Cliquez sur **Accepter**, puis sur **En préparation**, **Marquer prête** et enfin **Terminer**. Pour une livraison, contrôlez toujours l’adresse avant d’accepter. Le système actuel enregistre la commande et prévoit une confirmation par téléphone ; il ne réalise pas de paiement en ligne.

## Gérer les plats

Dans la section **Carte**, chaque article affiche son nom, son prix et son état. Cliquez sur **Actif** pour le masquer temporairement lorsqu’un produit est en rupture. Cliquez sur **Masqué** pour le remettre en ligne. Vérifiez le site public après une modification. Les prix et descriptions doivent être modifiés uniquement lorsque l’équipe a validé la nouvelle carte.

## Alertes WhatsApp automatiques

Le dashboard affiche une carte **Alertes WhatsApp**. Elle indique si l’intégration officielle est active ou si elle attend encore la configuration Meta. Lorsqu’elle est active, une notification est envoyée automatiquement à l’hôte après l’arrivée d’une réservation ou d’une commande.

Pour l’activation, le propriétaire doit fournir un compte WhatsApp Business Platform/Meta, un numéro professionnel vérifié, un **Phone Number ID**, un jeton système permanent et un modèle de message approuvé. Les variables utilisées sont : identifiant, nom du client, date/heure ou montant, type de commande et téléphone. Le jeton doit rester une variable secrète côté serveur et ne doit jamais être placé dans le code frontend.

Le modèle recommandé est un modèle utilitaire en français, par exemple :

> Nouvelle demande Per Voi\nRéférence : {{1}}\nClient : {{2}}\nDétail : {{3}}\nType / personnes : {{4}}\nTéléphone : {{5}}\nOuvrez le dashboard pour traiter la demande.

Meta exige que les modèles soient approuvés avant l’envoi en dehors de la fenêtre de service client. La configuration utilise les variables serveur `WHATSAPP_ACCESS_TOKEN`, `WHATSAPP_PHONE_NUMBER_ID`, `WHATSAPP_HOST_PHONE`, `WHATSAPP_TEMPLATE_NAME`, `WHATSAPP_TEMPLATE_LANGUAGE` et `WHATSAPP_API_VERSION`. Consultez la documentation officielle [WhatsApp Cloud API](https://developers.facebook.com/documentation/business-messaging/whatsapp/get-started) et [Templates](https://developers.facebook.com/documentation/business-messaging/whatsapp/templates/overview).

## Bonnes pratiques quotidiennes

Ouvrez le dashboard avant le service, cliquez sur **Actualiser**, vérifiez les créneaux et traitez les demandes en attente. Marquez rapidement les horaires complets. En fin de service, terminez les commandes traitées et contrôlez qu’aucune réservation urgente n’est restée en attente. Ne supprimez pas une commande pour corriger une erreur : utilisez son statut et conservez une trace.

## Dépannage rapide

Si une commande n’apparaît pas, cliquez sur **Actualiser** et vérifiez la connexion. Si un créneau est absent, contrôlez la date et le fait que ce ne soit pas un lundi. Si WhatsApp est indiqué comme non configuré, le site fonctionne toujours mais l’alerte automatique n’est pas active ; il faut vérifier les variables Meta côté hébergement. Pour toute modification de prix, d’horaires ou de compte administrateur, contactez le responsable technique du site.
