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
    sigla: "CPChoque",
    nome: "Comando de Policiamento de Choque",
    subtitulo: "Comando de Policiamento de Choque · PMESP",
    missao:
      "Planejar, coordenar e fiscalizar as operações de policiamento tático especializado, controle de distúrbios civis e ações táticas especiais em todo o Estado de São Paulo, servindo como a principal reserva estratégica do Comando Geral para a restauração da ordem pública e enfrentamento da criminalidade violenta.",
    historia:
      "A origem do policiamento de choque em São Paulo remonta às tropas de infantaria da antiga Força Pública no início do século XX. Com o aumento das manifestações populares, a expansão urbana e o surgimento de novas demandas de segurança pública nas décadas de 1960 e 1970, a PMESP centralizou suas unidades de pronta resposta e controle de distúrbios sob um único comando especializado, consolidando o CPChoque como o grande comando gestor das tropas de elite do Estado.",
    contato:
      "Para informações institucionais, entre em contato pelos canais oficiais do CPChoque — Polícia Militar do Estado de São Paulo.",
  },
  {
    sigla: "COE/GATE",
    nome: "Comandos e Operações Especiais / Grupo de Ações Táticas Especiais",
    subtitulo: "Comandos e Operações Especiais (COE) · Grupo de Ações Táticas Especiais (GATE) · 4º BPChq",
    missao:
      "Atuar de forma integrada na resolução de crises operacionais de altíssima complexidade, tanto em meio urbano quanto em ambientes rurais, de mata ou terrenos hostis. O COE executa operações de alto risco, busca, resgate e neutralização de criminosos encurralados em locais de difícil acesso, enquanto o GATE atua no resgate de reféns, neutralização de atiradores ativos, desarmamento e varredura de artefatos explosivos e cumprimento de mandados contra alvos de altíssima periculosidade.",
    historia:
      "O COE originou-se da Companhia de Operações Especiais fundada em 1970, posteriormente incorporada ao 4º Batalhão de Policiamento de Choque, com a missão de combater focos de guerrilha rural e operar em terrenos de difícil acesso. Já o GATE foi criado em 3 de agosto de 1988, também vinculado ao 4º BPChq, para gerenciar crises urbanas de alta gravidade, inspirado em doutrinas internacionais de SWAT e unidades de contraterrorismo. Hoje, ambos operam de forma unificada como a referência da corporação em operações táticas especiais.",
    contato:
      "Para informações institucionais, entre em contato pelos canais oficiais do COE/GATE — 4º BPChq.",
  },
];
