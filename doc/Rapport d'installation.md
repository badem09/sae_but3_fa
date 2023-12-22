
Pour installer notre projet il faut avoir docker d'installé et de lancé.

Si cela n'est pas le cas voici un rapide tutoriel pour debian :

cette commande supprime les packages pour éviter les conflicts :
```shell
for pkg in docker.io docker-doc docker-compose podman-docker containerd runc; do sudo apt-get remove $pkg; done
```
Pour set up le répertoire apt :
```shell
# Add Docker's official GPG key:
sudo apt-get update
sudo apt-get install ca-certificates curl gnupg
sudo install -m 0755 -d /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/debian/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg
sudo chmod a+r /etc/apt/keyrings/docker.gpg

# Add the repository to Apt sources:
echo \
"deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/debian \
$(. /etc/os-release && echo "$VERSION_CODENAME") stable" | \
sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
sudo apt-get update
```
Pour installer docker :
```shell
sudo apt-get install docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
```

Pour tester docker :
```shell
sudo docker run hello-world
```
Si cela marche vous pouvez passer a l'étape suivante sinon voici un lien qui devrait vous aider : 

https://docs.docker.com/engine/install/

une fois docker installé et lancé il suffit de lancer cette commande :

Attention si le port 80 est deja utilisé il faut le changer avec -p "ici le port que vous voulez":80

sinon :

```shell
docker run -dit --name sac_noel_2 -p 80:80 twip4/sae_noel:1.1
```

une fois le container lancé vous pouvez vérifié avec docker ps :

il suffit de se rendre sur l'adresse localhost dans votre navigateur.

Explication de la réalisation du docker :

J'ai créé un container avec comme image debian :

```shell
docker pull debian
docker run -dit --name sae_noel -p 80:80 debian
docker exec -it "id container" /bin/bash
```

une fois dans le container j'ai installé les différents services et application nécessaire ainsi que cloné le projet :

```shell
Update upgrade

apt-get install apache

apt install php libapache2-mod-php php-mysql

apt-get install iputils-ping

apt-get install git

apt-get install nano

cd /home

git clone https://github.com/badem09/sae_but3_fa.git
```

une fois tous installé il a fallut configuré apache :

```shell
service apache2 start

sudo chown -R $USER:$USER /home/sae_but3_fa

sudo chmod -R 755 /home/sae_but3_fa

nano /etc/apache2/sites-available/sae.conf

 <VirtualHost *:80>

    ServerAdmin admin@example.com

    DocumentRoot /home/sae_but3_fa/src

    ServerName example.com

    ServerAlias www.example.com

  

    <Directory /home/sae_but3_fa/src>

        Options Indexes FollowSymLinks

        AllowOverride None

        Require all granted

    </Directory>

  

    ErrorLog ${APACHE_LOG_DIR}/error.log

    CustomLog ${APACHE_LOG_DIR}/access.log combined

</VirtualHost>

a2ensite sae.conf

a2dissite 000-default.conf

apache2ctl configtest

service apache2 reload

service apache2 start
```

une fois apache configuré il a fallut cree un dockerfile pour automatisé le démarrage de apache lors du lancement du container :

```shell
docker commit "id container initial" twip4/sae_noel:1.1
```

```shell
FROM "idImageCree"
ENTRYPOINT service apache2 start && /bin/bash
```

une fois la nouvelle image créé grace au dockerfile il a fallut la mettre en ligne dans un répertoire docker hub pour la rendre accessible.

```shell
docker build -t twip4/sae_noel:1.1 . 

docker login

docker push twip4/sae_noel:1.1
```

une fois l'image push sur le répertoire docker hub il suffit pour la lancer depuis n'importe quel pc disposant de docker de faire cette commande :

```shell
docker run -dit --name sac_noel_2 -p 80:80 twip4/sae_noel:1.1
```