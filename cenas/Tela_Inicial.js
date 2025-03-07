// Definindo a cena de boas-vindas usando a biblioteca Phaser
var background; 
class TelaInicial extends Phaser.Scene {
   
    // Construtor da cena
    constructor() {
        super({
            key: 'TelaInicial',
            backgroundColor: '#000', // Configuração da cor de fundo da cena
        });
    }

    
    // Pré-carregamento de recursos
    preload() {
        this.load.image("play", "assets/play_bt.png"); // Carregando a imagem do botão "play"
        this.load.image('bg', 'assets/background_inicial.png'); 
    }

    // Função chamada quando a cena é criada
    create() {
        
        this.background = this.add.image(0, 0, 'bg').setOrigin(0, 0);


        // Configuração do botão de "play"
        this.playBt = this.add.image(this.game.config.width / 2 - 120, this.game.config.height / 4 * 1.7, 'play')
            .setScale(.5).setOrigin(0, 0).setInteractive().setVisible(false);

        this.playBt.setVisible(true);    

        // Configuração de evento para iniciar o jogo ao clicar no botão "play"
        this.playBt.on('pointerdown', function () {
                this.game.highScore = 0;
                this.scene.start('TelaJogo', this.game);
                this.playBt.setVisible(false);
               
                
        }, this);
        
       
      
    }


}