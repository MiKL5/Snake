/* snake
* Serpent */

window.onload = function(){
    let canvasWidth = 900;
    let canvasHeight = 600;
    let blockSize = 30;
    let ctx;
    let delay = 100; // en ms
    let snake;
    let apple;
    let widthInBlocks = canvasWidth/blockSize;
    let heightInBlocks = canvasHeight/blockSize;
    let score;
    let timeOut;
    
    init();

    function init(){
        let canvas = document.createElement('canvas');
        canvas.width = canvasWidth;
        canvas.height = canvasHeight;
        canvas.style.border = "30px solid #090068";
        canvas.style.margin = "50px auto";
        canvas.style.display = "block";
        canvas.style.backgroundColor = "#FFF8DE";
        document.body.appendChild(canvas); // appendChild affiche le canvas
        ctx = canvas.getContext('2d');
        snake = new createSnake([[5,4], [4,4], [3,4]], "right");
        apple = new createApple([10,10]);
        score = 0;
        refreshCanvas();
    }

    function refreshCanvas(){
        snake.advance();
        if(snake.checkCollision()){
            gameOver();
        } else {
            if(snake.isEatingApple(apple)){
                score++;
                snake.ateApple = true;
                do {
                    apple.setNewPosition();
                } while(apple.isOnSnake(snake));
            }
            ctx.clearRect(0,0,canvasWidth,canvasHeight);
            drawScore(); // en 1er ; il doit être derière le serpent et la pomme
            snake.draw();
            apple.draw();
            timeOut = setTimeout(refreshCanvas, delay); // évite que le rafraichissement d'avant et cumulé a celui d'aprés et que le serpent aille plus vite
        }
    }

    function gameOver(){
        ctx.save();
        ctx.font = "bold 70px sans-serif";
        ctx.fillStyle = "#000";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.strokeStyle = "white";
        ctx.lineWidth = 5;
        let centerX = canvasWidth / 2;
        let centerY = canvasHeight / 2;
        ctx.strokeText("Perdu !", centerX, centerY - 180);
        ctx.fillText("Perdu !", centerX, centerY - 180);
        ctx.font = "bold 30px sans-serif";
        ctx.strokeText("Appuyer sur Espace pour rejouer", centerX, centerY - 120);
        ctx.fillText("Appuyer sur Espace pour rejouer", centerX, centerY - 120);
        ctx.restore();
    }

    function restart(){
        snake = new createSnake([[5,4], [4,4], [3,4]], "right");
        apple = new createApple([10,10]);
        score = 0;
        clearTimeout(timeOut);
        refreshCanvas();
    }

    function drawScore(){
        ctx.save();
        ctx.font = "bold 200px sans-serif";
        ctx.fillStyle = "gray";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        let centerX = canvasWidth / 2;
        let centerY = canvasHeight / 2;
        ctx.fillText(score.toString(), centerX, centerY);
        ctx.restore();
    }

    function drawBlock(ctx, position){
        let x = position[0] * blockSize; // = nb de pixel
        let y = position[1] * blockSize;
        ctx.fillRect(x, y, blockSize, blockSize);
    }

    function createSnake(body, direction){
        this.body = body;
        this.direction = direction;
        this.ateApple = false;
        this.draw = function(){
            ctx.save();
            ctx.fillStyle = "#17FF00";
            for(let i = 0; i < this.body.length; i++){
                drawBlock(ctx, this.body[i]);
            }
            ctx.restore(); // dessine sur le contexte et le restaurer
        }
        this.advance = function(){
            let nextPosition=this.body[0].slice();
            switch(this.direction){
                case "left":
                    nextPosition[0] -= 1;
                    break;
                case "up":
                    nextPosition[1] -= 1;
                    break;
                case "right":
                    nextPosition[0] += 1;
                    break;
                case "down":
                    nextPosition[1] += 1;
                    break;
                default:
                    throw("invalid direction");
            }
            this.body.unshift(nextPosition);
            if(!this.ateApple)
                this.body.pop(); // supprime le dernier élément du tableau
            else
                this.ateApple = false;
        }
        this.setDirection = function (newDirection){
            let allowedDirection; // directions permises
            switch (this.direction){
                case "left":
                case "right":
                    allowedDirection = ["up", "down"];
                    break;
                case "up":
                case "down":
                    allowedDirection = ["left", "right"];
                    break;
                default:
                    throw("invalid direction");
            }
            if (allowedDirection.indexOf(newDirection) > -1){ // change de direction si c'est possible
                this.direction = newDirection
            }
        }
        this.checkCollision = function(){ // verifier si le serpent se mord ou veut sortir
            let wallCollision = false;
            let snakeCollision = false;
            let head = this.body[0];
            let rest = this.body.slice(1);
            let snakeHeadX = head[0];
            let snakeHeadY = head[1];
            let minX = 0; // collision avec le mur
            let minY = 0;
            let maxX = widthInBlocks - 1;
            let maxY = heightInBlocks - 1;
            let isNotBetweenHorizontalWalls = snakeHeadX < minX || snakeHeadX > maxX;
            let isNotBetweenVerticalWalls = snakeHeadY < minY || snakeHeadY > maxY;
            if(isNotBetweenHorizontalWalls || isNotBetweenVerticalWalls){
                wallCollision = true;
            for(let i = 0; i < rest.length; i++){ // Si le serpent ne se mord pas
                if(snakeHeadY === rest[i][0] && snakeHeadY === rest[i][0])
                    snakeCollision = true;
            }
            return wallCollision || snakeCollision;
        }
    }
        this.isEatingApple = function(appleToEat){
            let head = this.body[0];
            if(head[0] === appleToEat.position[0] && head[1] === appleToEat.position[1]) // UNE LIGNE ; LES ACOLADES SONT SUPERFETATOIRES
                return true;
            else
                return false;
        }
    }

    function createApple(position){
            this.position = position;
            this.draw = function(){
                ctx.save();
                ctx.fillStyle = "#A71414"; // rouge
                ctx.beginPath();
                let radius = blockSize / 2;
                let x = this.position[0] * blockSize + radius;
                let y = this.position[1] * blockSize + radius;
                ctx.arc(x, y, radius, 0, Math.PI * 2  , true); // dessine le cercle
                ctx.fill(); // le rempli
                ctx.restore();
            }
            this.setNewPosition = function(){
                let newAppleX = Math.round(Math.random() * (widthInBlocks -1));
                let newAppleY = Math.round(Math.random() * (heightInBlocks -1));
                this.position = [newAppleX, newAppleY];
            }
            this.isOnSnake = function(snakeToCheck){ // ne pas la placer sur le serpent
                let isOnSnake = false;
                for(let i = 0; i < snakeToCheck.body.length; i++){
                    if(this.position[0] === snakeToCheck.body[i][0] && this.position[1] === snakeToCheck.body[i][1]){
                        isOnSnake =  true; // vérif 1/1, c'est une boucle
                    }
                }
                return isOnSnake;
            }
        }

    document.onkeydown = function handleKeyDown(e){
        let key = e.keyCode; // touche enfoncée
        let newDirection;
        switch(key){
            case 37: // flèche vers la gauche
                newDirection = "left";
                break;
            case 38: // haut
                newDirection = "up";
                break;
            case 39: // droite
                newDirection = "right";
                break;
            case 40: // bas
                newDirection = "down";
                break;
            case 32:// espace
                restart();
                return;
            default:
                return;
        }
        snake.setDirection(newDirection);
    }
}