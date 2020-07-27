//ao final do código, o enunciado do exercício estará comentado

//importando File System
import fs from 'fs';

//criando as variaveis que serão usadas
//states e cities recebem o conteudo dos arquivos json
const states = './assets/estados.json';
const cities = './assets/cidades.json';
//statesFile recebe o conteudo que será criado mais pra frente na pasta apontada
const statesFile = './assets/states/';
//arrays que serão manipulados para o exercicio
let statesList = [];
let citiesList = [];
let citiesState = {};
let loadedStates = [];

//a esta função prepara os arquivos Json states e cities e passa pelo método
//parse para que se tornem lidas, e n apenas objetos
const load = async () => {
  const promiseStates = fs.promises.readFile(states);
  const promiseCities = fs.promises.readFile(cities);
  const leitura = await Promise.all([promiseStates, promiseCities]);
  statesList = JSON.parse(leitura[0]);
  citiesList = JSON.parse(leitura[1]);
};

// esta função carrega os jsons anteriores e separa os estados,
//preparando para criar o arquivo statesFile
const loadStates = async () => {
  const statesPromises = statesList.map((state) => {
    const prom = fs.promises.readFile(`${statesFile}${state.Sigla}.json`);
    return { Sigla: state.Sigla, promise: prom };
  });
  const promises = statesPromises.map((state) => state.promise);
  const statesMap = statesPromises.map((state) => state.Sigla);
  const leitura = await Promise.all(promises);
  leitura.forEach((rawState, idx) => {
    const cities = JSON.parse(rawState);
    citiesState[statesMap[idx]] = cities;
  });
};

//a função createStateFiles irá criar os arquivos Json para cada estado
//ver passo 1 do exercício
const createStateFiles = async () => {
  const statePromises = statesList.map(({ ID, Sigla }) => {
    loadedStates.push(Sigla);
    const stateCities = citiesList
      .filter((city) => city.Estado === ID)
      .map(({ ID, Nome }) => {
        return { ID, Nome };
      });
    //esse retorno cria um arquivo Json na pasta indicada com o nome da sigla do estado
    return fs.promises.writeFile(
      `./assets/states/${Sigla}.json`,
      JSON.stringify(stateCities)
    );
  });
  //este promise.all repete a função statePromises para todos os estados
  await Promise.all(statePromises);
};

const countStateCities = (stateInitials) => {
  return citiesState[stateInitials].length;
};

const getCitiesCount = () => {
  const citiesCount = loadedStates.map((initials) => {
    return { Sigla: initials, citiesCount: countStateCities(initials) };
  });
  return citiesCount;
};

const printStatesWithMoreCities = () => {
  let cities = getCitiesCount().sort(
    (prev, curr) => curr.citiesCount - prev.citiesCount
  );
  console.log('Estados com mais cidades');
  console.log(cities.slice(0, 5));
};

const printStatesWithLessCities = () => {
  let cities = getCitiesCount().sort(
    (prev, curr) => prev.citiesCount - curr.citiesCount
  );
  console.log('Estados com menos cidades');
  console.log(cities.slice(0, 5));
};

const getGreatestCitiesNames = () => {
  const greatestCities = loadedStates.map((stateInitials) => {
    const cities = citiesState[stateInitials];
    const sortedCities = cities.sort((prev, curr) => {
      const size = curr.Nome.length - prev.Nome.length;
      if (size === 0) {
        return prev.Nome.localeCompare(curr.Nome);
      }
      return size;
    });
    return { Estado: stateInitials, maiorCidade: sortedCities[0].Nome };
  });
  return greatestCities;
};

const printGreatestCitiesNames = () => {
  console.log('Cidade com maior nome por estado: ');
  console.log(getGreatestCitiesNames());
};

const getSmallestCitiesNames = () => {
  const smallestCities = loadedStates.map((stateInitials) => {
    const cities = citiesState[stateInitials];
    const sortedCities = cities.sort((prev, curr) => {
      const size = prev.Nome.length - curr.Nome.length;
      if (size === 0) {
        return prev.Nome.localeCompare(curr.Nome);
      }
      return size;
    });
    return { Estado: stateInitials, maiorCidade: sortedCities[0].Nome };
  });
  return smallestCities;
};

const printSmallestCitiesNames = () => {
  console.log('Cidade com menor nome por estado: ');
  console.log(getSmallestCitiesNames());
};

const printGreatestCity = () => {
  const greatestCities = getGreatestCitiesNames().sort((prev, curr) => {
    const size = curr.maiorCidade.length - prev.maiorCidade.length;
    if (size === 0) {
      return prev.maiorCidade.localeCompare(curr.maiorCidade);
    }
    return size;
  });
  console.log('cidade com maior nome: ');
  console.log(greatestCities[0]);
};

const printSmallestCity = () => {
  const smallestCities = getSmallestCitiesNames().sort((prev, curr) => {
    const size = prev.maiorCidade.length - curr.maiorCidade.length;
    if (size === 0) {
      return prev.maiorCidade.localeCompare(curr.maiorCidade);
    }
    return size;
  });
  console.log('cidade com menor nome: ');
  console.log(smallestCities[0]);
};

const runApp = async () => {
  await load();
  await createStateFiles();
  await loadStates();

  printStatesWithMoreCities();
  printStatesWithLessCities();
  printGreatestCitiesNames();
  printSmallestCitiesNames();
  printGreatestCity();
  printSmallestCity();
};

runApp();

/* 
ENUNCIADO DO EXERCICIO

Os alunos deverão desempenhar as seguintes atividades:
1. Criar uma função que irá criar um arquivo JSON para cada estado representado no
arquivo Estados.json, e o seu conteúdo será um array das cidades pertencentes a
aquele estado, de acordo com o arquivo Cidades.json. O nome do arquivo deve ser
o UF do estado, por exemplo: MG.json.

2. Criar uma função que recebe como parâmetro o UF do estado, realize a leitura do
arquivo JSON correspondente e retorne a quantidade de cidades daquele estado.

3. Criar um método que imprima no console um array com o UF dos cinco estados
que mais possuem cidades, seguidos da quantidade, em ordem decrescente. Você
pode usar a função criada no tópico 2. Exemplo de impressão: [“UF - 93”, “UF - 82”,
“UF - 74”, “UF - 72”, “UF - 65”]

4. Criar um método que imprima no console um array com o UF dos cinco estados
que menos possuem cidades, seguidos da quantidade, em ordem decrescente.
Você pode usar a função criada no tópico 2. Exemplo de impressão: [“UF - 30”, “UF
- 27”, “UF - 25”, “UF - 23”, “UF - 21”]

5. Criar um método que imprima no console um array com a cidade de maior nome de
cada estado, seguida de seu UF. Por exemplo: [“Nome da Cidade – UF”, “Nome da
Cidade – UF”, ...].

6. Criar um método que imprima no console um array com a cidade de menor nome
de cada estado, seguida de seu UF. Por exemplo: [“Nome da Cidade – UF”, “Nome
da Cidade – UF”, ...].

7. Criar um método que imprima no console a cidade de maior nome entre todos os
estados, seguido do seu UF. Exemplo: “Nome da Cidade - UF".

8. Criar um método que imprima no console a cidade de menor nome entre todos os
estados, seguido do seu UF. Exemplo: “Nome da Cidade - UF".
Observações:

- Nos itens que tratam a respeito do tamanho do nome da cidade, em caso de
empate no tamanho entre várias cidades, você deve considerar a ordem alfabética para
ordenar as cidades pelo seu nome, e então retornar a primeira cidade.

- Você deve considerar os nomes das cidades da forma que estão no arquivo,
mesmo que tenha observações no nome entre parênteses. Exemplo: Cidade X (antiga
Cidade Y).

- Ao rodar o projeto, ele deve executar os métodos em sequência e depois finalizar
a execução. */
