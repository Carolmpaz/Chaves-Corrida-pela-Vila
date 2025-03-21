// Definindo a cena principal do jogo usando a biblioteca Phaser
class TelaJogo extends Phaser.Scene {

    // Construtor da cena
    constructor() {
        super({
            key: 'TelaJogo',
            // Configurações específicas da cena
             physics: {
               arcade: {
                debug: false,
                gravity: { y: 400 }
               } 
            },
            scale: {
                mode: Phaser.Scale.FIT,
                autoCenter: Phaser.Scale.CENTER_BOTH
            }, 
        });
    }

    // Inicialização de variáveis e configurações da cena
    init() {
        // FUNDO - realiza a mudança de posição da cena 
        this.tela = {
            x_start: 0,
            x: 0,
            y: 200,
            x_end: -800,
            obj: null
        };

        // BARRIL - define os valores de configuração das barreiras 

        this.barreira = {
            speed: 80, // velocidade com que os barris passam
            space: 180, // espaço entre os barris 
            x: 300, // posição inicial para aparição dos barris 
            min_x: 400, //define a mínima posição horizontal do barril 
            max_x: 800, //define a máxima posição horizontal do barril 
            y: -400, // define a posição vertical para iniciação dos barris
            min_y: -500, //define a mínima posição vertical do barril 
            max_y: -200, //define a máxima posição vertical do barril 
            height: 600, // define a altura da imagem do barril
            width: 50, // define a largura da imagem do barril
            barreira1_obj: null,
            barreira1_obj: null

        };

        // JOGADOR - define o tamanho da variável e não atribui nenhum valor a ela
        this.player = {
            width: 170,
            height: 133,
            obj: null
        };

        // CONTROLES DA RODADA - define os parametros do jogo e cria a variável do botão de "restart"
        this.gameControls = {
            over: false,
            current_col_scored: false,
            score: 0,
            restartBt: null
        };
    }

    // Pré-carregamento dos recursos
    preload() {
        this.load.image('tela', 'assets/background.jpg');
        this.load.spritesheet('chaves', 'assets/sprite.png', { frameWidth: this.player.width, frameHeight: this.player.height });
        this.load.spritesheet('chaves_2', 'assets/sprite_2.png', { frameWidth: this.player.width, frameHeight: this.player.height });
        this.load.image('colBottom', 'assets/obstaculo.png');
        this.load.image('restart', 'assets/restart_bt.avif');
        this.load.image('lanche', 'assets/sanduiche.png');
        this.load.audio('musica_fundo', 'assets/musica.mp3'); 
        this.load.image('controle', 'assets/controle.webp');
    }

    // Criação de elementos e configurações iniciais da cena
    create() {

        
        // Adiciona uma música de fundo ao jogo
        this.musica = this.sound.add('musica_fundo', { volume: 0.5, loop: true });
        this.musica.play();

        // Adiciona a imagem de fundo
        this.tela.obj = this.add.image(0, 0, 'tela').setOrigin(0, 0);

        // Adiciona imagens das barreiras (barris)
        this.barreira.barreira1_obj = this.add.image(this.barreira.x, this.barreira.y + this.barreira.height + this.barreira.space, 'colBottom').setScale(1).setOrigin(0, 0);
        this.physics.add.existing(this.barreira.barreira1_obj);
        this.barreira.barreira1_obj.body.allowGravity = false;
        this.barreira.barreira1_obj.body.setVelocityX(-this.barreira.speed);
        this.barreira.barreira1_obj.body.setSize(this.barreira.barreira1_obj.width * 0.8, this.barreira.barreira1_obj.height * 0.8); // Reduz a área de colisão
        this.barreira.barreira1_obj.body.setOffset((this.barreira.barreira1_obj.width - this.barreira.barreira1_obj.body.width) / 2, (this.barreira.barreira1_obj.height - this.barreira.barreira1_obj.body.height) / 2); // Centraliza a colisão

        // Verifica a orientação da tela  
        if(game.scale.orientation === Phaser.Scale.LANDSCAPE){
            this.player.obj = this.physics.add.sprite(100, 500, 'chaves').setScale(1.8); // adiciona um sprite
            this.player.obj.body.setSize(50, 80, true);
            this.player.obj.setCollideWorldBounds(true);

            this.anims.create({ // configura a animação do player
                key: 'fly',
                frames: this.anims.generateFrameNumbers('chaves', { start: 0, end: 2 }),
                frameRate: 7,
                repeat: -1
            });
         
        } else if(game.scale.orientation === Phaser.Scale.PORTRAIT){
            this.player.obj = this.physics.add.sprite(100, 500, 'chaves_2').setScale(1.8); // muda o sprite adicionado anteriormente 
            this.player.obj.body.setSize(50, 80, true);
            this.player.obj.setCollideWorldBounds(true);

            this.anims.create({ // configura a animação do player
                key: 'fly',
                frames: this.anims.generateFrameNumbers('chaves_2', { start: 0, end: 2 }),
                frameRate: 7,
                repeat: -1
            });
        }


        // Remove a gravidade do player
        this.player.obj.body.allowGravity = true;

       
        // Adiciona a animação do movimento do jogador
        this.player.obj.anims.play('fly');

  
        // Adiciona os cursores que movimentarão o jogador
        this.cursors = this.input.keyboard.createCursorKeys();

        // Adiciona as interações de colisão entre o player e os obstáculos
        this.physics.add.overlap(this.player.obj, this.barreira.barreira1_obj, this.hitCol, null, this);

        // Mostra o placar - define o estilo do texto e adiciona imagem do botão de reinicialização
        this.scoreText = this.add.text(15, 15,  + ': 0', { fontSize: '20px', fill: '#000' });
        this.highScoreText = this.add.text(0, 15, 'recorde: ' + this.game.highScore, { fontSize: '20px', fill: '#000', align: 'right' });
        this.highScoreText.x = this.game.config.width - this.highScoreText.width - 15;
        this.gameControls.restartBt = this.add.image(this.game.config.width / 2 - 100, this.game.config.height / 3,'restart').setScale(.6).setOrigin(0, 0).setInteractive().setVisible(false);
    

        // Adiciona evento de clique no botão de "reiniciar"
        this.gameControls.restartBt.on('pointerdown', function () {
            // Controla se o jogo acabou e se a tecla que o botão de reiniciar foi acionado
            if (this.gameControls.over) {
                this.gameControls.over = false;
                this.gameControls.score = 0;
                this.barreira.x = -this.barreira.width - 1;
                this.scene.restart();
            }
        }, this);

        // Cria o desenho do lanche com física ativada 
        this.lanche = this.physics.add.image(Phaser.Math.Between(100, this.game.config.width - 100), 0, 'lanche').setScale(.15);
        this.lanche.setCollideWorldBounds(true); // Impede que o lanche saia da tela
        this.lanche.setBounce(0.7); // Faz o lanche quicar quando atinge o solo
        this.lanche.setGravityY(300); // Aplica a gravidade no eixo Y para que ele caia
        
        this.physics.add.overlap(this.player.obj, this.lanche, coletarLanche, null, this); // Configura a colisão entre o desenho do lanche e o player
        
        

        // Cria a lista que irá guardar o número de lanches coletados
        this.lanches = [];

        // Configura a função que cria e remove lanches na tela, conforme eles são coletados e adiciona um novo item a lista a cada coleta. 
        function coletarLanche(player_obj, lanche) {
            this.lanche.setVisible(false); // Esconde o lanche temporariamente
            let novaPosicaoY = Phaser.Math.Between(50, 550);
            lanche.setPosition(Phaser.Math.Between(100, this.game.config.width - 100), novaPosicaoY);
            this.lanche.setVisible(true); // Mostra a lanche novamente
            this.lanches.push(this.lanche);
            this.scoreText.setText('Placar' + ': ' + (this.lanches.length - 1)); // Atualiza o placar com o número de barris pulados e de moedas coletadas 
        };
        

     
      
    }
        


    // Atualização lógica do jogo a cada frame
    update() {

            // Verifica se a seta esquerda foi pressionada e movimenta o personagem caso ela tenha sido pressionada 
            if (this.cursors.left.isDown)
            {
                this.player.obj.setVelocityX(-400);
        
            }
            // Verifica se a seta direita foi pressionada e movimenta o personagem caso ela tenha sido pressionada 
            else if (this.cursors.right.isDown)
            {
                this.player.obj.setVelocityX(400);

            }
            // Caso nenhuma das duas setas tenham sido pressionadas, não realiza nenhum movimento vertical 
            else
            {
                this.player.obj.setVelocityX(0);

            }
        
            // Verifica se a seta superior foi pressionada e movimenta o personagem caso ela tenha sido pressionada 
            if (this.cursors.up.isDown ) {

                this.player.obj.setVelocityY(-450); // Pulo para cima
            }

        // Controla se o jogo acabou e paraliza a cena (interrompendo a execução de "update")
        if (this.gameControls.over) {
            return;
        }

        // Atualiza a posição da imagem de fundo
        this.tela.x--;
        if (this.tela.x < this.tela.x_end) {
            this.tela.x = this.tela.x_start;
        }
        this.tela.obj.x = this.tela.x;

        // Atualiza posição das barreiras
        this.barreira.x = this.barreira.barreira1_obj.x;
        if (this.barreira.x < -this.barreira.width) {
            this.barreira.x = Phaser.Math.FloatBetween(this.barreira.min_x, this.barreira.max_x); // sorteia o intervalo antes das próximas colunas
            this.barreira.barreira1_obj.x = this.barreira.x;

            this.barreira.y = this.barreira.y; // Define o mesmo valore de Y para todos os barris
            this.barreira.barreira1_obj.y = this.barreira.y + this.barreira.height + this.barreira.space;

            this.gameControls.current_col_scored = false;
        }

        this.player.obj.body.touching.down;
        
    
    
    }

    // Função chamada quando o jogador colide com uma coluna - quando identificada uma colisão o jogo para e o valor do recorde é registardo
    hitCol(player_obj, col_obj) {
        this.physics.pause();
        this.player.obj.anims.stop('fly');
        this.player.obj.setTint(0xff0000);
        this.gameControls.over = true;
        this.gameControls.restartBt.visible = true;
        while (this.gameControls.score > this.game.highScore) {
            this.game.highScore = this.gameControls.score;
            this.highScoreText.setText('Recorde: ' + this.game.highScore);
            break
        } 
        
    }


    adicionarColuna(x) {
        let coluna = this.physics.add.image(this.barreira.x, this.barreira.y + this.barreira.height + this.barreira.space, 'colBottom').setOrigin(0, 0);
        coluna.body.allowGravity = false;
        coluna.body.setVelocityX(-this.barreira.speed);
        this.colunas.add(coluna);
    }

}
