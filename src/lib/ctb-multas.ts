export type Severity = "transito";

export interface MultaCTB {
  artigo: string;
  titulo: string;
  descricao: string;
  valor: number;
  severity: Severity;
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
];

export const formatBRL = (v: number) =>
  new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL", minimumFractionDigits: 2 }).format(v);

export const SEV_META: Record<Severity, { label: string; classes: string; dot: string }> = {
  transito: {
    label: "Trânsito",
    classes: "border-amber-500/50 text-amber-500 bg-amber-500/10",
    dot: "bg-amber-500",
  },
};
