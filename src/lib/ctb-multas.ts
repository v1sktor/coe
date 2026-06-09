export type Severity = "gravissima" | "grave" | "media";

export interface MultaCTB {
  artigo: string;
  descricao: string;
  valor: number;
  severity: Severity;
}

export const MULTAS_CTB: MultaCTB[] = [
  { artigo: "Art. 231, V", descricao: "Infrações por excesso de peso ou lotação (S/ Fiança)", valor: 40000, severity: "gravissima" },
  { artigo: "Art. 162", descricao: "Dirigir veículo sem possuir carteira de habilitação ou documento vencido", valor: 3000, severity: "media" },
  { artigo: "Art. 165", descricao: "Dirigir sob influência de álcool ou drogas", valor: 6000, severity: "gravissima" },
  { artigo: "Art. 165-A", descricao: "Recusar-se a ser submetido ao teste do etilômetro", valor: 6000, severity: "gravissima" },
  { artigo: "Art. 167", descricao: "Deixar de utilizar o cinto de segurança", valor: 4000, severity: "grave" },
  { artigo: "Art. 169", descricao: "Dirigir sem atenção ou cuidados à segurança", valor: 4000, severity: "grave" },
  { artigo: "Art. 172", descricao: "Atirar do veículo ou abandonar na via objetos", valor: 6000, severity: "grave" },
  { artigo: "Art. 173", descricao: "Disputar corrida", valor: 20000, severity: "gravissima" },
  { artigo: "Art. 175", descricao: "Utilizar o veículo para exibir manobra perigosa", valor: 16000, severity: "gravissima" },
  { artigo: "Art. 176, I", descricao: "Deixar o condutor de prestar socorro em acidentes", valor: 24000, severity: "gravissima" },
  { artigo: "Art. 180", descricao: "Imobilizar o veículo na via por estar sem combustível", valor: 6000, severity: "grave" },
  { artigo: "Art. 181", descricao: "Parar ou estacionar o veículo em locais proibidos", valor: 8000, severity: "grave" },
  { artigo: "Art. 186", descricao: "Transitar pela contramão de direção", valor: 10000, severity: "gravissima" },
  { artigo: "Art. 190", descricao: "Seguir veículo policial ou em situação de emergência", valor: 10000, severity: "gravissima" },
  { artigo: "Art. 192", descricao: "Deixar de guardar distância de segurança", valor: 4000, severity: "grave" },
  { artigo: "Art. 193", descricao: "Transitar com o veículo em locais proibidos", valor: 10000, severity: "gravissima" },
  { artigo: "Art. 194", descricao: "Transitar de marcha à ré", valor: 14000, severity: "gravissima" },
  { artigo: "Art. 195", descricao: "Desobedecer às ordens emanadas do agente policial", valor: 9000, severity: "grave" },
  { artigo: "Art. 206", descricao: "Executar operação de retorno em local proibido", valor: 4000, severity: "grave" },
  { artigo: "Art. 208", descricao: "Avançar o sinal vermelho ou de parada obrigatória", valor: 6000, severity: "gravissima" },
  { artigo: "Art. 210", descricao: "Evasão de blitz policial", valor: 45000, severity: "gravissima" },
  { artigo: "Art. 218", descricao: "Transitar em velocidade superior à máxima permitida", valor: 6000, severity: "grave" },
  { artigo: "Art. 227", descricao: "Utilizar buzina prolongada ou em desacordo", valor: 4000, severity: "media" },
  { artigo: "Art. 228", descricao: "Usar som veicular em áreas proibidas", valor: 10000, severity: "grave" },
  { artigo: "Art. 231", descricao: "Transitar com o veículo em mau estado de conservação", valor: 8500, severity: "grave" },
  { artigo: "Art. 231, V", descricao: "Transitar com veículo excedendo peso permitido", valor: 6000, severity: "grave" },
  { artigo: "Art. 235", descricao: "Conduzir pessoas ou animais em partes externas", valor: 6000, severity: "grave" },
  { artigo: "Art. 244", descricao: "Conduzir motocicleta sem capacete e outros", valor: 1500, severity: "media" },
  { artigo: "Art. 253", descricao: "Bloquear a via com o veículo", valor: 6500, severity: "grave" },
];

export const formatBRL = (v: number) =>
  new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL", minimumFractionDigits: 0 }).format(v);

export const SEV_META: Record<Severity, { label: string; classes: string; dot: string }> = {
  gravissima: { label: "Gravíssima", classes: "border-destructive/50 text-destructive bg-destructive/10", dot: "bg-destructive" },
  grave: { label: "Grave", classes: "border-primary/50 text-primary bg-primary/10", dot: "bg-primary" },
  media: { label: "Média", classes: "border-accent/50 text-accent bg-accent/10", dot: "bg-accent" },
};