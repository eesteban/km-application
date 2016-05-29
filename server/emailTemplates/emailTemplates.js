Accounts.emailTemplates.siteName = 'Patxi Larrainzar - Proiektua';
Accounts.emailTemplates.from = "Endika Esteban <administration@km-application.com>";
Accounts.emailTemplates.enrollAccount = {
    subject: function () {
        return 'Izen emate emaila - Endika Esteban-en gradu amaierako proiektua';
    },
    text: function (user, url) {
        return 'Web aplikazioan izena emateko hurrengo estekan sakatu:\n\n'+
                url + '\n\n' +
                'Momentuz ez daude funtzionalitate guztiak, hauek momentuz garaturiko atalak:\n' +
                '       - Taldeak, foroa barne\n' +
                '       - Profil pertsonala, bloga, fitxategiak (elementu txikiak igo bakarrik mesedez), eta mezularitza barne\n'+
                'Edozein akats edo arazo izatekotan hurrengo helbidean kontaktatu mesedez: endikae94@gmail.com';
    }
};

