export default {
  token: '',
  centralServer: {
    id: '',
    reportsLogChannelId: '',
  },
  messages: {
    error: {
      error: 'Erreur',
      unknownError: 'Une erreur inconnue est survenue',
      invalidUuidOrName: 'UUID ou pseudo invalide',
      invalidDiscordId: 'ID Discord invalide',
      invalidUuidOrNameOrDiscordId: 'UUID, pseudo ou ID Discord invalide',
      proof_missing: 'Vous n\'avez pas inclu de preuve(s) de l\'arnaque',
      scammerAlreadyInList: '%scammer% est déjà dans la liste des arnaqueurs',
      scammerNotInList: 'L\'arnaqueur n\'est pas dans la liste des arnaqueurs',
      cannotFindCentralServer: 'Impossible de joindre le serveur central',
      cannotFindGuild: 'Impossible de trouver le serveur d\'exécution',
      cannotFindCurrentName: 'Impossible de récupérer le pseudo actuel',
      tooFewPermissions: 'Vous n\'avez pas les permissions nécessaires pour faire ceci',
      missinguuid_or_discord_id:"Vous devez indiquez un username mc ou un identifiant discord",
    },
    actions: {
      scammerAdded: {
        title: 'Arnaqueur ajouté',
        description: '%scammer% a été ajouté à la liste des arnaqueurs',
      },
      scammerRemoved: {
        title: 'Arnaqueur retiré',
        description: '%scammer% a été retiré de la liste des arnaqueurs',
      },
      scammerEdited: {
        title: 'Arnaqueur modifié',
        description: '%scammer% a été modifié',
      },
      scammerForceRemoved: {
        title: 'Arnaqueur retiré de force',
        description: '%scammer% a été retiré de force de la liste des arnaqueurs',
      },
    },
    notifications: {
      scammerAdded: {
        title: 'Arnaqueur ajouté',
        description: '"%scammer%" a été ajouté à la liste des arnaqueurs',
      },
      scammerRemoved: {
        title: 'Arnaqueur retiré',
        description: '"%scammer%" a été retiré de la liste des arnaqueurs',
      },
      scammerForceRemoved: {
        title: 'Arnaqueur retiré de force',
        description: '"%scammer%" a été retiré de force de la liste des arnaqueurs',
      },
      reasons: {
        ban: 'L\'utilisateur à été ajouté à la liste des arnaqueurs',
        unban: 'L\'utilisateur à été retiré de la liste des arnaqueurs',
      },
    },
    report: {
      buttonLabel:'Signaler un utilisateur',
      modal: {
        title: 'Signaler un arnaqueur',
        uuidOrName: {
          label: 'UUID ou pseudo de l\'arnaqueur',
          placeholder: 'Jeb_',
        },
        discordId: {
          label: 'ID Discord de l\'arnaqueur',
          placeholder: '319498304259902730',
        },
        proof: {
          label: 'Explication de l\'arnaque',
          placeholder: 'Décrivez ici l\'arnaque réalisée par le joueur et comment il la réalise',
        },
        prooflink:{
          label: 'Preuve(s) de l\'arnaque',
          placeholder:'Lien(s) obligatoire(s) des preuves de l\'arnaque (images, vidéos...)',
        }
      },
      logEmbed: {
        title: 'Signalement d\'un arnaqueur',
        description:
          '<@%scammerId%> à été signalé par <@%reporterId%>\n\n' +
          'Pseudo: %scammerName%\n' +
          'UUID: %scammerUuid%\n' +
          'ID Discord: %scammerId%\n',
      },
    },
    manualBan: {
      ban: {
        buttonLabel: 'Bannir l\'utilisateur',
        success: 'Vous avez bien banni l\'arnaqueur "%scammer%" du serveur',
        error: 'Une erreur est survenue lors du bannissement de l\'arnaqueur "%scammer%" du serveur',
      },
      unban: {
        buttonLabel: 'Dé-bannir l\'utilisateur',
        success: 'Vous avez bien dé-banni l\'utilisateur "%scammer%" du serveur',
        error: 'Une erreur est survenue lors du dé-bannissement de l\'utilisateur "%scammer%" du serveur',
      },
    },
    autoBan: {
      enabled: 'L\'auto-ban est désormais activé',
      disabled: 'L\'auto-ban est désormais désactivé',
    },
    check: {
      buttonLabel: 'Vérifier un utilisateur',
      embedDescription: 'Avec ce nouveau système, vous pouvez vérifier si un utilisateur est dans la liste des arnaqueurs\n\n\n' +
        '🔍 Cliquez sur le bouton ci-dessous pour vérifier un joueur\n'+
        '⚠️ Cliquez sur le bouton ci-dessous pour signaler un joueur',
      modal: {
        uuidOrNameOrDiscordId: {
          label: 'UUID, pseudo ou ID Discord de l\'utilisateur',
          placeholder: 'Jeb_',
        },
      },
    },
    logChannel: {
      set: 'Les logs seront désormais envoyés dans ce salon',
      unset: 'Les logs ne seront plus envoyés dans ce salon',
    },
    default: {
      reason: 'Pas de raison renseignée',
      proof: 'Pas de preuves renseignées',
    },
    reportSent: 'Votre signalement a bien été envoyé',
    Ban_Menu:{
      option1:'Ajouter à la scamlist',
      option2:'Manque d\'information',
      option3:'Joueur inexistant',
      option4:'Autre'
    },
    reponse_signalement:{
      titre:'Suivi du signalement de scam du joueur "%scammer%"\n\n\n',
      refus_manque_preuve: "Nous avons refusé votre signalement à cause d'un manque de preuve et d'information",
      refus_joueur_innexistant: "Nous avons refusé votre signalement car le joueur que vous avez signalé n'existe pas",
      accepte:"Nous avons ajouté le joueur %scammer% dans notre base de donnée, merci à vous"
    },
    scammer_found:{
      titre_emebd:"Information du joueur :",
      message_description:"Nous te conseillons de ne pas trade avec lui. Si jamais tu penses que c'est une erreur, va voir le staff d'un de nos serveurs Discord partenaires",
      soustitre_scam_list:"__**· Scamlist :**__",
      soustitre_level:"__**· Level :\n**__",
      soustitre_guild:"__**· Guilde :\n**__",
      soustutre_discord:"__**· Discord\n**__"
    },
    scammer_not_found:{
      titre_embed:"Information du joueur :",
      message_description:"Si jamais tu te fais arnaquer, va voir le staff d'un de nos serveurs Discord partenaires\n",
    },
    rembourse:"Ce joueur est désormais marque comme ayant remboursé son scam",
    ReturnReport:{
      Informationmissing:"Le joueur %joueur% a bien été informé du manque d'information du signalement",
      Joueurinnexistant:"Le joueur %joueur% a bien été informé du fait que le joueur n'existe pas",
      custommessagereply:"Le joueur %joueur% a bien reçu le message",
      Ban:'Le joueur %joueur% a bien été informé que son report a donné suite à un ban',
      customMessage:{
        title:"Envoyer un message définis",
        description:{
          label:'Texte à envoyer',
          placeholder:'Merci pour le signalement, nous l\'avons déjà bannis'
        },
        MessageLog:"Le joueur %player% a bien reçu le message %texte%"
      },
      newinfo:{
        title:'Nouvelles informations',
        descrption_pseduo:{
          label:'Pseudo minecraft',
          placeholder:"Pseudo minecraft"
        },
        description_discord:{
          label:"Id discord",
          placeholder:'Id Discord'
        },
        description_raison:{
          label:"Raison",
          placeholder:"Raison"
        }
      }
    },
    listeserver:{
      liste_serveur:"liste des serveurs",
      notenoughperm:"Vous n'avez pas assez de permissions pour executer cette commande",
      sucess:"Le bot a bien été enlevé du serveur %server%",
      serverunfoundable:"le serveur %serveur% est introuvable",
      nombre_serveur:"Actuallement le bot a rejoint :"
    },
    absencedeprofit:'Ce joueur n\' a pas les api ouvertes sur cette statistique ou n\'a jamais joué au skyblock'
  },base: { // Voir https://typeorm.io/data-source-options#common-data-source-options
    type: 'better-sqlite3',
    database: 'database.sqlite3',
  },
  colors: {
    error: 0xFF0000,
    success: 0x00FF00,
    info: 0x0000FF,
    neutral: 0x808080,
  },
  API: {
    hypixelapi: "https://api.hypixel.net/",
    hypixelkey:"",
    info: 0x0000FF,
    neutral: 0x808080,
  },
} as const
