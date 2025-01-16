<!DOCTYPE html>
<html>
    <head>
        <title>Bienvenue sur notre plateforme</title>
    </head>
    <body>
        <h1>Bienvenue, {{ $name }}</h1>
        <p>Nous avons créé un compte pour vous sur notre plateforme. Voici vos informations :</p>
        <ul>
            <li><strong>Nom complet :</strong> {{ $name }}</li>
            <li><strong>Email :</strong> {{ $email }}</li>
            <li><strong>Mot de passe :</strong> {{ $password }}</li>
        </ul>
        <strong>Modifiez votre mot de passe en arrivant dans l'application afin d'éviter tout soucis de sécurité !</strong>
        <p>Connectez-vous pour commencer !</p>
    </body>
</html>
