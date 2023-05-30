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
      scammerAlreadyInList: 'L\'arnaqueur est déjà dans la liste des arnaqueurs',
      scammerNotInList: 'L\'arnaqueur n\'est pas dans la liste des arnaqueurs',
      cannotFindCentralServer: 'Impossible de joindre le serveur central',
      cannotFindGuild: 'Impossible de trouver le serveur d\'exécution',
      cannotFindCurrentName: 'Impossible de récupérer le pseudo actuel',
      tooFewPermissions: 'Vous n\'avez pas les permissions nécessaires pour faire ceci',
    },
    actions: {
      scammerAdded: {
        title: 'Arnaqueur ajouté',
        description: 'L\'arnaqueur a été ajouté à la liste des arnaqueurs',
      },
      scammerRemoved: {
        title: 'Arnaqueur retiré',
        description: 'L\'arnaqueur a été retiré de la liste des arnaqueurs',
      },
      scammerEdited: {
        title: 'Arnaqueur modifié',
        description: 'L\'arnaqueur a été modifié',
      },
      scammerForceRemoved: {
        title: 'Arnaqueur retiré de force',
        description: 'L\'arnaqueur a été retiré de force de la liste des arnaqueurs',
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
          label: 'Preuves à l\'encontre de l\'arnaqueur',
          placeholder: 'Preuves obligatoires (ajouter des liens pour les vidéos, images, etc.)',
        },
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
        'Cliquez sur le bouton ci-dessous pour vérifier un utilisateur',
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
  },
  database: { // Voir https://typeorm.io/data-source-options#common-data-source-options
    type: 'better-sqlite3',
    database: 'database.sqlite3',
  },
  colors: {
    error: 0xFF0000,
    success: 0x00FF00,
    info: 0x0000FF,
    neutral: 0x808080,
  },
} as const