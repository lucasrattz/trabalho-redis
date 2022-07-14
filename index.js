require('./redis_connect');
const rl = require('readline').createInterface(
    process.stdin, process.stdout
);

const config = require("./config.json");

const redisClient = redisConnect();

generateNumbers = () => {
    let numbers = [];
    for(let i = 0; i < 6; i++) {
        numbers[i] = Math.floor(60 * Math.random() + 1);
    }
    return numbers;
}

generateWinners = () => {
    let winners;
    winners = Math.floor(21 * Math.random());

    return winners;
}

populateRecords = () => {
    redisClient.connect();
    const startDate = new Date(config.start_date);
    startDate.setHours(startDate.getHours() + 12);
    const endDate = new Date(Date.now());
    let i = 0;
    while(startDate.valueOf() <= endDate.valueOf()) {
        if(/Wed/.test(startDate.toDateString())) {
            redisClient.hSet("numero_sorteio:" + i, "numero_sorteio", i);
            redisClient.hSet("numero_sorteio:" + i, "data", startDate.toISOString().split('T')[0]);
            redisClient.hSet("numero_sorteio:" + i, "numeros", generateNumbers().join(','));
            redisClient.hSet("numero_sorteio:" + i, "ganhadores", generateWinners());

            redisClient.hSet("data:" + startDate.toISOString().split('T')[0], "numero_sorteio", i);

            startDate.setDate(startDate.getDate() + 3);
            i++;
        } else
        if(/Sat/.test(startDate.toDateString())) {
            redisClient.hSet("numero_sorteio:" + i, "numero_sorteio", i);
            redisClient.hSet("numero_sorteio:" + i, "data", startDate.toISOString().split('T')[0]);
            redisClient.hSet("numero_sorteio:" + i, "numeros", generateNumbers().join(','));
            redisClient.hSet("numero_sorteio:" + i, "ganhadores", generateWinners());

            redisClient.hSet("data:" + startDate.toISOString().split('T')[0], "numero_sorteio", i);

            startDate.setDate(startDate.getDate() + 4);
            i++;
        } 
        else startDate.setDate(startDate.getDate() + 1);
    }
    redisClient.quit();
}

menu = () => {rl.question(`
    1 - Gerar resultados aleatórios.\n
    2 - Consultar resultados por número de sorteio.\n
    3 - Consultar resultados por data do sorteio.\n\n
    0 - Sair.\n\n
`, option => {
    if(option == 0) process.exit();
    if(option == 1) {
        populateRecords();
        console.log("Resultados gerados com sucesso.\n\n");
        menu();
    }
    if(option == 2) {
        rl.question(`\nDigite o número do sorteio: `, async number => {
            redisClient.connect();
            let output = {};
            output = await redisClient.hGetAll('numero_sorteio:' + number);
            if(Object.keys(output).length === 0)
            console.log("Não há sorteio com este número em registro.");
            else console.log(JSON.stringify(output, null, "\t"));

            redisClient.quit();
            console.log("\n\n");
            menu();
        })
    }
    if(option == 3) {
        rl.question(`\nDigite a data do sorteio (YYYY-MM-DD): `, async date => {
            redisClient.connect();
            let output = {};
            const _date = new Date(date);
            output = await redisClient.hGetAll('data:' + _date.toISOString().split('T')[0]);
            if(Object.keys(output).length === 0){
                console.log("Não há sorteio com esta data em registro.");
            } else {
                output = await redisClient.hGetAll('numero_sorteio:' + output['numero_sorteio']);
                console.log(JSON.stringify(output, null, "\t"));
            }
            redisClient.quit();
            console.log("\n\n");
            menu();
        })
    }
})
}

menu();