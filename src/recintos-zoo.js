class RecintosZoo {
  constructor() {
    this.recintos = [
      { numero: 1, bioma: "savana", tamanhoTotal: 10, animais: [{ especie: "MACACO", quantidade: 3 }] },
      { numero: 2, bioma: "floresta", tamanhoTotal: 5, animais: [] },
      { numero: 3, bioma: "savana e rio", tamanhoTotal: 7, animais: [{ especie: "GAZELA", quantidade: 1 }] },
      { numero: 4, bioma: "rio", tamanhoTotal: 8, animais: [] },
      { numero: 5, bioma: "savana", tamanhoTotal: 9, animais: [{ especie: "LEAO", quantidade: 1 }] }
    ];

    this.animaisPermitidos = {
      "LEAO": { tamanho: 3, biomas: ["savana"], carnivoro: true },
      "LEOPARDO": { tamanho: 2, biomas: ["savana"], carnivoro: true },
      "CROCODILO": { tamanho: 3, biomas: ["rio"], carnivoro: true },
      "MACACO": { tamanho: 1, biomas: ["savana", "floresta"], carnivoro: false },
      "GAZELA": { tamanho: 2, biomas: ["savana"], carnivoro: false },
      "HIPOPOTAMO": { tamanho: 4, biomas: ["savana", "rio"], carnivoro: false }
    };
  }

  analisaRecintos(tipo, quantidade) {
    // Valida o tipo de animal
    const animalPermitido = this.animaisPermitidos[tipo];
    if (!animalPermitido) {
      return { erro: "Animal inválido" };
    }

    // Valida a quantidade
    if (!Number.isInteger(quantidade) || quantidade <= 0) {
      return { erro: "Quantidade inválida" };
    }

    // Calcula o tamanho necessário
    const tamanhoNecessario = animalPermitido.tamanho * quantidade;
    let recintosViaveis = [];

    for (let recinto of this.recintos) {
      // Calcula o espaço ocupado
      const espacoOcupado = recinto.animais.reduce((acc, { especie, quantidade }) => {
        const tamanhoEspecie = this.animaisPermitidos[especie].tamanho * quantidade;
        return acc + tamanhoEspecie;
      }, 0);

      // Calcula o espaço disponível
      const espacoDisponivel = recinto.tamanhoTotal - espacoOcupado;

      // Verifica compatibilidade do bioma
      const biomaCompativel = animalPermitido.biomas.some(bioma =>
        recinto.bioma === bioma || (bioma === "savana" && recinto.bioma === "savana e rio")
      );
      if (!biomaCompativel) {
        continue;
      }

      // Verifica a mistura de carnívoros e herbívoros
      const animaisNoRecinto = recinto.animais;
      const carnivorosNoRecinto = animaisNoRecinto.some(a => this.animaisPermitidos[a.especie].carnivoro);
      const herbivorosNoRecinto = animaisNoRecinto.some(a => !this.animaisPermitidos[a.especie].carnivoro);

      if (animalPermitido.carnivoro && herbivorosNoRecinto) {
        continue; // Não aceita carnívoros com herbívoros
      }

      if (carnivorosNoRecinto && !animalPermitido.carnivoro) {
        continue; // Não aceita herbívoros com carnívoros
      }

      // Verifica a quantidade de carnívoros existentes da mesma espécie
      const carnivorosDaMesmaEspecie = animaisNoRecinto.filter(a => a.especie === tipo && this.animaisPermitidos[a.especie].carnivoro).length;

      if (animalPermitido.carnivoro && carnivorosNoRecinto && !carnivorosDaMesmaEspecie) {
        continue;
      }

      // Verifica se o recinto é adequado para hipopótamos
      if (tipo === "HIPOPOTAMO" && recinto.animais.length > 0 && recinto.bioma !== "savana e rio") {
        continue;
      }

      // Verifica se o recinto é adequado para macacos
      if (tipo === "MACACO" && quantidade === 1 && animaisNoRecinto.length === 0) {
        continue; // Não permite um macaco sozinho em um recinto vazio
      }

      // Verifica espaço extra se houver mais de uma espécie no recinto
      const espacoExtra = recinto.animais.length > 0 && recinto.animais.some(a => a.especie !== tipo) ? 1 : 0;
      const espacoNecessario = tamanhoNecessario + espacoExtra;

      if (espacoDisponivel >= espacoNecessario) {
        recintosViaveis.push({
          numero: recinto.numero,
          espacoLivre: espacoDisponivel - espacoNecessario, // Aplicando o cálculo do espaço extra corretamente
          total: recinto.tamanhoTotal
        });
      }
    }

    if (recintosViaveis.length === 0) {
      return { erro: "Não há recinto viável" };
    }

    recintosViaveis.sort((a, b) => a.numero - b.numero);

    return {
      recintosViaveis: recintosViaveis.map(r => `Recinto ${r.numero} (espaço livre: ${r.espacoLivre} total: ${r.total})`)
    };
  }
}

// Testando a função
const zoo = new RecintosZoo();
console.log(zoo.analisaRecintos("HIPOPOTAMO", 1)); // Teste com 1 leopardo
export { RecintosZoo };
