export type Severity = "transito" | "pessoa" | "patrimonio";

export interface MultaCTB {
  artigo: string;
  titulo: string;
  descricao: string;
  valor: number;
  severity: Severity;
  /** Pena em meses (aplicável aos crimes contra a pessoa) */
  pena?: number;
}

export const MULTAS_CTB: MultaCTB[] = [

  { artigo: "Art. 162", titulo: "Falta de combustível", descricao: "Ter o veículo imobilizado na via por falta de combustível.", valor: 150, severity: "transito" },
  { artigo: "Art. 162", titulo: "Dirigir sem habilitação", descricao: "Dirigir sem possuir habilitação, podendo ocorrer o recolhimento do veículo.", valor: 150, severity: "transito" },
  { artigo: "Art. 165-A", titulo: "Recusar-se ao teste do bafômetro", descricao: "Recusar-se a realizar o teste do bafômetro.", valor: 1000, severity: "transito" },
  { artigo: "Art. 173", titulo: "Disputar corrida", descricao: "Praticar rachas ou corridas ilegais.", valor: 650, severity: "transito" },
  { artigo: "Art. 175", titulo: "Direção perigosa", descricao: "Uso negligente, imprudente ou perigoso de um veículo.", valor: 2000, severity: "transito" },
  { artigo: "Art. 176", titulo: "Transitar na contramão", descricao: "Trafegar pela via em sentido contrário ao permitido.", valor: 600, severity: "transito" },
  { artigo: "Art. 181", titulo: "Estacionar em local proibido", descricao: "Deixar o veículo estacionado em local indevido ou proibido.", valor: 650, severity: "transito" },
  { artigo: "Art. 181", titulo: "Veículo abandonado", descricao: "Abandonar o veículo em local indevido.", valor: 700, severity: "transito" },
  { artigo: "Art. 183", titulo: "Avançar sinal vermelho", descricao: "Avançar o sinal vermelho do semáforo.", valor: 650, severity: "transito" },
  { artigo: "Art. 194", titulo: "Transitar de marcha ré", descricao: "Transitar em marcha ré de forma indevida ou ultrapassar a faixa de retenção para realizar manobra.", valor: 300, severity: "transito" },
  { artigo: "Art. 199", titulo: "Ultrapassar pela direita", descricao: "Utilizar a faixa da direita para realizar uma ultrapassagem.", valor: 1000, severity: "transito" },
  { artigo: "Art. 210", titulo: "Ultrapassar blitz", descricao: "Transpor, sem autorização, bloqueio viário policial.", valor: 850, severity: "transito" },
  { artigo: "Art. 218", titulo: "Alta velocidade", descricao: "Limite de velocidade dentro da cidade: 120 km/h. Veículos de grande porte: 90 km/h. Acrescenta-se R$ 25,00 a cada 20 km/h excedidos.", valor: 600, severity: "transito" },
  { artigo: "Art. 218", titulo: "Seguir veículo policial em situação emergencial", descricao: "Seguir viaturas durante ocorrências, fugas ou situações de emergência.", valor: 1000, severity: "transito" },
  { artigo: "Art. 244", titulo: "Conduzir motocicleta sem capacete", descricao: "Trafegar com motocicleta sem utilizar capacete.", valor: 1300, severity: "transito" },
  { artigo: "Art. 304", titulo: "Omissão de socorro", descricao: "Quando o causador de dano ou lesão abandona o local sem prestar socorro.", valor: 650, severity: "transito" },

  // ===== Crimes contra a pessoa =====
  { artigo: "Art. 3º", titulo: "Genocídio", descricao: "Praticar homicídio doloso direcionado por motivos de etnia ou condição do sexo feminino.", valor: 3000, pena: 60, severity: "pessoa" },
  { artigo: "Art. 121", titulo: "Homicídio", descricao: "Matar alguém.", valor: 850, pena: 40, severity: "pessoa" },
  { artigo: "Art. 121-A", titulo: "Homicídio de funcionário público", descricao: "Matar funcionário público durante sua função ou em razão dela.", valor: 3000, pena: 60, severity: "pessoa" },
  { artigo: "Art. 121-B", titulo: "Homicídio culposo", descricao: "Matar alguém em razão de imprudência, negligência ou imperícia.", valor: 1500, pena: 30, severity: "pessoa" },
  { artigo: "Art. 129", titulo: "Lesão corporal", descricao: "Ofender a integridade física ou a saúde de outrem.", valor: 550, pena: 5, severity: "pessoa" },
  { artigo: "Art. 129 III", titulo: "Lesão corporal seguida de morte", descricao: "Ofender a integridade física ou a saúde de outrem, resultando em morte.", valor: 1500, pena: 30, severity: "pessoa" },
  { artigo: "Art. 130", titulo: "Calúnia", descricao: "Imputar falsamente a alguém fato definido como crime.", valor: 450, pena: 10, severity: "pessoa" },
  { artigo: "Art. 139", titulo: "Difamação", descricao: "Imputar a alguém fato ofensivo à sua reputação.", valor: 450, pena: 10, severity: "pessoa" },
  { artigo: "Art. 147", titulo: "Ameaça", descricao: "Ameaçar alguém, por qualquer meio, de causar mal injusto e grave.", valor: 600, pena: 20, severity: "pessoa" },
  { artigo: "Art. 148", titulo: "Sequestro e cárcere privado", descricao: "Privar alguém de sua liberdade mediante sequestro ou cárcere privado.", valor: 1500, pena: 45, severity: "pessoa" },
  { artigo: "Art. 287", titulo: "Incitação e/ou apologia ao crime", descricao: "Fazer apologia de fato criminoso ou de autor de crime, ou incentivar a prática de crimes.", valor: 850, pena: 25, severity: "pessoa" },

  // ===== Crimes contra o patrimônio =====
  { artigo: "Art. 155 I", titulo: "Furto qualificado", descricao: "Subtrair, para si ou para outrem, coisa alheia móvel.", valor: 550, pena: 30, severity: "patrimonio" },
  { artigo: "Art. 155", titulo: "Furto", descricao: "Subtrair, para si ou para outrem, coisa alheia móvel.", valor: 350, pena: 25, severity: "patrimonio" },
  { artigo: "Art. 157", titulo: "Roubo", descricao: "Subtrair coisa alheia móvel, para si ou para outrem, mediante violência ou grave ameaça.", valor: 750, pena: 40, severity: "patrimonio" },
  { artigo: "Art. 157-B", titulo: "Roubo seguido de morte (latrocínio)", descricao: "Subtrair coisa alheia móvel, para si ou outrem, mediante violência ou grave ameaça, com resultado morte.", valor: 1000, pena: 50, severity: "patrimonio" },
  { artigo: "Art. 157 II", titulo: "Roubo qualificado", descricao: "Apropriar-se de bens, valores ou dinheiro sob sua responsabilidade.", valor: 900, pena: 50, severity: "patrimonio" },
  { artigo: "Art. 171", titulo: "Estelionato", descricao: "Obter, para si ou outrem, vantagem ilícita, em prejuízo alheio, por meio de fraude, erro, artifício ou ardil.", valor: 2500, pena: 12, severity: "patrimonio" },
  { artigo: "Art. 126", titulo: "Desmonte de veículos", descricao: "Adquirir, receber, transportar, desmontar, conduzir ou ocultar automotor terrestre.", valor: 2500, pena: 10, severity: "patrimonio" },
  { artigo: "Art. 180", titulo: "Recepção", descricao: "Adquirir, receber, transportar, conduzir ou ocultar, em proveito próprio ou alheio, coisa que saiba ser produto de crime.", valor: 2500, pena: 10, severity: "patrimonio" },
];


export const formatBRL = (v: number) =>
  new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL", minimumFractionDigits: 2 }).format(v);

export const SEV_META: Record<Severity, { label: string; classes: string; dot: string }> = {
  transito: {
    label: "Trânsito",
    classes: "border-amber-500/50 text-amber-500 bg-amber-500/10",
    dot: "bg-amber-500",
  },
  pessoa: {
    label: "Contra a pessoa",
    classes: "border-red-500/50 text-red-500 bg-red-500/10",
    dot: "bg-red-500",
  },

};
