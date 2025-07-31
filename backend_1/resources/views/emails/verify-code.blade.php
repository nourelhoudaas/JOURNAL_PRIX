<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <title>Code de vérification</title>
</head>
<body style="font-family: Arial, sans-serif; background-color: #f3f4f6; padding: 20px;">
    <div style="max-width: 600px; margin: auto; background: white; padding: 30px; border-radius: 8px; box-shadow: 0 0 10px rgba(0,0,0,0.05);">
        <h2 style="color: #1d4ed8;">Bonjour {{ $comptee->username }},</h2>

        <p style="font-size: 16px; color: #374151;">
            Merci de vous être inscrit sur <strong>MonApp</strong>. Pour activer votre compte, veuillez saisir le code de vérification ci-dessous :
        </p>

        <div style="text-align: center; margin: 30px 0;">
            <span style="display: inline-block; background: #1d4ed8; color: white; padding: 15px 30px; font-size: 24px; border-radius: 6px;">
                {{ $comptee->email_verification_code }}
            </span>
        </div>

        <p style="font-size: 16px; color: #374151;">
            Ce code est valide pendant 15 minutes.<br>
            Si vous n’avez pas demandé ce code, vous pouvez ignorer cet e-mail.
        </p>

        <p style="margin-top: 30px; font-size: 14px; color: #6b7280;">
            Ministère de la communication
        </p>
    </div>
</body>
</html>
