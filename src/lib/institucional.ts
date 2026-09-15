export interface UnidadeInstitucional {
  sigla: string;
  nome: string;
  subtitulo: string;
  missao: string;
  historia: string;
  contato: string;
}

export const INSTITUCIONAL: UnidadeInstitucional[] = [
  {
    sigla: "PMESP",
    nome: "Polícia Militar do Estado de São Paulo",
    subtitulo: "Polícia Militar do Estado de São Paulo",
    missao:
      "Exercer a polícia ostensiva e a preservação da ordem pública em todo o território paulista, prevenindo e combatendo o crime, garantindo a incolumidade das pessoas, do patrimônio e dos direitos fundamentais, além de atuar em missões de defesa civil e resgate.",
    historia:
      "Fundada em 15 de dezembro de 1831 pelo Brigadeiro Rafael Tobias de Aguiar (então Presidente da Província de São Paulo), nasceu com o nome de Corpo de Municipais Permanentes. Ao longo de quase dois séculos de história, a corporação passou por diversas denominações — como Força Pública de São Paulo — e combateu em conflitos marcantes da história brasileira, como a Guerra do Paraguai (1864–1870), a Revolução Constitucionalista de 1932 e a Segunda Guerra Mundial (enviando integrantes para a FEB). Em 1970, com a fusão da Força Pública e da Guarda Civil de São Paulo, assumiu a denominação atual de Polícia Militar do Estado de São Paulo.",
    contato:
      "Para informações institucionais, entre em contato pelos canais oficiais da Polícia Militar do Estado de São Paulo.",
  },
  {
    sigla: "CPA",
    nome: "Comando de Policiamento de Área",
    subtitulo: "Comando de Policiamento de Área · PMESP",
    missao:
      "Planejar, coordenar, fiscalizar e gerenciar estrategicamente todas as atividades de policiamento ostensivo e preservação da ordem pública dentro da sua região de responsabilidade territorial.",
    historia:
      "Com o crescimento populacional e a expansão das cidades paulistas na segunda metade do século XX, a PMESP precisou descentralizar o comando das tropas. Foram criados os Comandos Regionais para gerenciar grandes zonas geográficas (como Zona Norte, Zona Sul, Região Metropolitana ou Interior via CPI), funcionando como verdadeiros QGs regionais da corporação.",
    contato:
      "Para informações institucionais, entre em contato pelos canais oficiais do CPA — Polícia Militar do Estado de São Paulo.",
  },
  {
    sigla: "BPM",
    nome: "Batalhão de Polícia Militar",
    subtitulo: "Batalhão de Polícia Militar · PMESP",
    missao:
      "Executar o policiamento ostensivo e preventivo ordinário (radiopatrulha, rondonismo, atendimento ao 190) na sua área de cobertura, garantindo a segurança comunitária e a manutenção da ordem pública local.",
    historia:
      "O Batalhão é uma das unidades mais tradicionais da estrutura militar paulista, herdada dos modelos organizacionais do Exército e das antigas Forças Públicas. Cada BPM é o \"rosto\" da PMESP em uma cidade inteira do interior ou em um grupo de bairros na capital, abrigando as companhias territoriais e os serviços administrativos.",
    contato:
      "Para informações institucionais, entre em contato pelos canais oficiais do BPM — Polícia Militar do Estado de São Paulo.",
  },
  {
    sigla: "FT",
    nome: "Força Tática",
    subtitulo: "Força Tática (FT) · PMESP",
    missao:
      "Realizar o patrulhamento tático reforçado na área de cobertura do seu Batalhão, combater a criminalidade violenta, apoiar viaturas de radiopatrulha em ocorrências de alto risco e atuar no controle de distúrbios civis de pequena escala.",
    historia:
      "Criada no início dos anos 1990 para substituir o antigo Tático Móvel. A PMESP identificou a necessidade de ter uma tropa própria dentro de cada Batalhão que fosse mais treinada e armada que a radiopatrulha comum, permitindo dar pronta resposta a ocorrências graves sem ter que aguardar o deslocamento do Choque ou da ROTA da capital.",
    contato:
      "Para informações institucionais, entre em contato pelos canais oficiais da Força Tática — Polícia Militar do Estado de São Paulo.",
  },
  {
    sigla: "ROCAM",
    nome: "ROCAM Tático",
    subtitulo: "Rondas Ostensivas com Apoio de Motocicletas · PMESP",
    missao:
      "Dar agilidade, mobilidade e resposta rápida ao patrulhamento tático do Batalhão. Sua função é interceptar criminosos em fuga por vias de difícil acesso ou trânsito denso, realizar abordagens rápidas a indivíduos em atitude suspeita e prover cerco tático imediato para apoiar as viaturas de Força Tática em ocorrências de maior gravidade.",
    historia:
      "A modalidade de policiamento sobre duas rodas surgiu na PMESP na década de 1980 (no Choque/ROTA) para vencer o trânsito travado da capital. Com o sucesso da ferramenta, a doutrina foi expandida e adaptada para dentro dos Batalhões de Área. Assim, criou-se a ROCAM Tático — pelotões de motociclistas integrados diretamente às Companhias de Força Tática para atuar em conjunto com as viaturas de quatro rodas (as \"barcas\").",
    contato:
      "Para informações institucionais, entre em contato pelos canais oficiais da ROCAM Tático — Polícia Militar do Estado de São Paulo.",
  },
];
