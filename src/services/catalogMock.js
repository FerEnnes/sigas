// src/services/catalogMock.js

/* ========= Cadastros (mock) ========= */
export const FORNECEDORES = [
  { id: 'forn_agromix', nome: 'AgroMix Insumos', email: 'contato@agromix.dev', cnpj: '11.111.111/0001-11' },
  { id: 'forn_campoforte', nome: 'Cooperativa Campo Forte', email: 'vendas@campoforte.dev', cnpj: '22.222.222/0001-22' },
  { id: 'forn_sementesul', nome: 'Sementes do Sul', email: 'comercial@sementesdosul.dev', cnpj: '33.333.333/0001-33' },
  { id: 'forn_fertbrasil', nome: 'Fertilizantes Brasil', email: 'suporte@fertbrasil.dev', cnpj: '44.444.444/0001-44' },
  { id: 'forn_irrigatec', nome: 'IrrigaTec Solutions', email: 'contato@irrigatec.dev', cnpj: '55.555.555/0001-55' },
];

export const PROPRIEDADES = [
  { id: 'prop_sitio_esperanca', descricao: 'Sítio Boa Esperança', cidade: 'Balneário Camboriú' },
  { id: 'prop_faz_santa_luzia', descricao: 'Fazenda Santa Luzia', cidade: 'Blumenau' },
  { id: 'prop_chacara_recanto', descricao: 'Chácara Recanto Verde', cidade: 'Joinville' },
  { id: 'prop_sitio_horizonte', descricao: 'Sítio Horizonte', cidade: 'Florianópolis' },
  { id: 'prop_faz_dois_rios', descricao: 'Fazenda Dois Rios', cidade: 'Tubarão' },
];

export const CLIENTES = [
  { id: 'cli_carlos', nome: 'Carlos Pereira', email: 'carlos.pereira@sigas.dev', cpfCnpj: '123.456.789-00' },
  { id: 'cli_empresaverde', nome: 'Empresa Verde LTDA', email: 'contato@empresaverde.dev', cpfCnpj: '12.345.678/0001-90' },
  { id: 'cli_mariana', nome: 'Mariana Souza', email: 'mariana.souza@sigas.dev', cpfCnpj: '987.654.321-00' },
];

/* ========= Plano de Contas (mock) ========= */
// SIMPLIFICADO
export const MOCK_SIMPLIFICADO = [
  { id: '1', codigo: '1', descricao: 'Ativos', subcontas: [] },
  { id: '2', codigo: '2', descricao: 'Passivo', subcontas: [] },
  { id: '3', codigo: '3', descricao: 'Saída de caixa', subcontas: [] },
  { id: '4', codigo: '4', descricao: 'Entrada de caixa', subcontas: [] },
];

// DETALHADO (compacto, mas com a mesma hierarquia/códigos principais)
export const MOCK_DETALHADO = [
  {
    id: 101, codigo: '1', descricao: 'Ativo', natureza: 'D',
    subcontas: [
      {
        id: 111, codigo: '1.1', descricao: 'Ativo Circulante', natureza: 'D',
        subcontas: [
          {
            id: 1111, codigo: '1.1.1', descricao: 'Disponível', natureza: 'D',
            subcontas: [
              { id: 11111, codigo: '1.1.1.1', descricao: 'Caixa', natureza: 'D', subcontas: [] },
              { id: 11112, codigo: '1.1.1.2', descricao: 'Movimentação na conta', natureza: 'D', subcontas: [] },
              { id: 11113, codigo: '1.1.1.3', descricao: 'Aplicações financeiras', natureza: 'D', subcontas: [] },
            ],
          },
          {
            id: 112, codigo: '1.1.2', descricao: 'Recebimentos', natureza: 'D',
            subcontas: [
              { id: 1121, codigo: '1.1.2.1', descricao: 'Clientes', natureza: 'D', subcontas: [] },
              { id: 1122, codigo: '1.1.2.2', descricao: 'Pagamentos a receber', natureza: 'D', subcontas: [] },
              { id: 1125, codigo: '1.1.2.5', descricao: 'Empréstimos a receber', natureza: 'D', subcontas: [] },
            ],
          },
          {
            id: 113, codigo: '1.1.3', descricao: 'Estoques', natureza: 'D',
            subcontas: [
              { id: 1131, codigo: '1.1.3.1', descricao: 'Mercadorias para venda', natureza: 'D', subcontas: [] },
              { id: 1132, codigo: '1.1.3.2', descricao: 'Produtos Finais', natureza: 'D', subcontas: [] },
            ],
          },
        ],
      },
      {
        id: 115, codigo: '1.1.5', descricao: 'Ativo não circulante', natureza: 'D',
        subcontas: [
          {
            id: 1151, codigo: '1.1.5.1', descricao: 'Direitos a longo prazo', natureza: 'D',
            subcontas: [
              { id: 11511, codigo: '1.1.5.1.1', descricao: 'Títulos a receber', natureza: 'D', subcontas: [] },
              { id: 11514, codigo: '1.1.5.1.4', descricao: 'Investimentos', natureza: 'D', subcontas: [] },
            ],
          },
          {
            id: 1152, codigo: '1.1.5.2', descricao: 'Imobilizados', natureza: 'D',
            subcontas: [
              { id: 11521, codigo: '1.1.5.2.1', descricao: 'Terrenos', natureza: 'D', subcontas: [] },
              { id: 11524, codigo: '1.1.5.2.4', descricao: 'Veículos', natureza: 'D', subcontas: [] },
              { id: 11525, codigo: '1.1.5.2.5', descricao: 'Marcas e patentes', natureza: 'D', subcontas: [] },
            ],
          },
        ],
      },
    ],
  },
  {
    id: 201, codigo: '2', descricao: 'Passivo', natureza: 'C',
    subcontas: [
      {
        id: 211, codigo: '2.1', descricao: 'Circulante', natureza: 'C',
        subcontas: [
          {
            id: 2111, codigo: '2.1.1', descricao: 'Obrigações fiscais', natureza: 'C',
            subcontas: [
              { id: 21111, codigo: '2.1.1.1', descricao: 'ICMS', natureza: 'C', subcontas: [] },
              { id: 21112, codigo: '2.1.1.2', descricao: 'ISS', natureza: 'C', subcontas: [] },
              { id: 21113, codigo: '2.1.1.3', descricao: 'INSS', natureza: 'C', subcontas: [] },
            ],
          },
          {
            id: 212, codigo: '2.1.2', descricao: 'Contas a pagar', natureza: 'C',
            subcontas: [
              { id: 2121, codigo: '2.1.2.1', descricao: 'Fornecedores', natureza: 'C', subcontas: [] },
              { id: 2122, codigo: '2.1.2.2', descricao: 'Salários', natureza: 'C', subcontas: [] },
            ],
          },
        ],
      },
      {
        id: 22, codigo: '2.2', descricao: 'Não Circulante', natureza: 'C',
        subcontas: [
          { id: 2221, codigo: '2.2.2.1', descricao: 'Capital', natureza: 'C', subcontas: [] },
          { id: 2222, codigo: '2.2.2.2', descricao: 'Reservas', natureza: 'C', subcontas: [] },
        ],
      },
    ],
  },
  {
    id: 301, codigo: '3', descricao: 'Custos', natureza: 'D',
    subcontas: [
      {
        id: 311, codigo: '3.1', descricao: 'Custos das mercadorias', natureza: 'D',
        subcontas: [
          { id: 3111, codigo: '3.1.1', descricao: 'Compra de mercadoria', natureza: 'D', subcontas: [] },
          { id: 3112, codigo: '3.1.2', descricao: 'Frete', natureza: 'D', subcontas: [] },
        ],
      },
      {
        id: 321, codigo: '3.2', descricao: 'Custo de Produção', natureza: 'D',
        subcontas: [
          { id: 3211, codigo: '3.2.1', descricao: 'Matéria-prima', natureza: 'D', subcontas: [] },
          { id: 3214, codigo: '3.2.4', descricao: 'Mão de obra', natureza: 'D', subcontas: [] },
        ],
      },
    ],
  },
  {
    id: 401, codigo: '4', descricao: 'Despesas', natureza: 'D',
    subcontas: [
      {
        id: 41, codigo: '4.1', descricao: 'Administrativas', natureza: 'D',
        subcontas: [
          { id: 411, codigo: '4.1.1', descricao: 'Aluguel', natureza: 'D', subcontas: [] },
          { id: 412, codigo: '4.1.2', descricao: 'Energia e Água', natureza: 'D', subcontas: [] },
          { id: 413, codigo: '4.1.3', descricao: 'Internet', natureza: 'D', subcontas: [] },
        ],
      },
      {
        id: 42, codigo: '4.2', descricao: 'Despesas financeiras', natureza: 'D',
        subcontas: [
          { id: 421, codigo: '4.2.1', descricao: 'Juros passivos', natureza: 'D', subcontas: [] },
          { id: 422, codigo: '4.2.2', descricao: 'Despesas com banco', natureza: 'D', subcontas: [] },
        ],
      },
      {
        id: 43, codigo: '4.3', descricao: 'Despesas comerciais', natureza: 'D',
        subcontas: [
          { id: 431, codigo: '4.3.1', descricao: 'Publicidade', natureza: 'D', subcontas: [] },
          { id: 432, codigo: '4.3.2', descricao: 'Brindes', natureza: 'D', subcontas: [] },
        ],
      },
    ],
  },
  {
    id: 501, codigo: '5', descricao: 'Receitas', natureza: 'C',
    subcontas: [
      {
        id: 51, codigo: '5.1', descricao: 'Receita de vendas', natureza: 'C',
        subcontas: [
          { id: 511, codigo: '5.1.1', descricao: 'Vendas de produto à vista', natureza: 'C', subcontas: [] },
          { id: 512, codigo: '5.1.2', descricao: 'Vendas de produto a prazo', natureza: 'C', subcontas: [] },
        ],
      },
      {
        id: 52, codigo: '5.2', descricao: 'Receita de prestação de serviço', natureza: 'C',
        subcontas: [
          { id: 521, codigo: '5.2.1', descricao: 'Serviço à vista', natureza: 'C', subcontas: [] },
          { id: 522, codigo: '5.2.2', descricao: 'Serviço a prazo', natureza: 'C', subcontas: [] },
        ],
      },
      {
        id: 53, codigo: '5.3', descricao: 'Receitas financeiras', natureza: 'C',
        subcontas: [
          { id: 531, codigo: '5.3.1', descricao: 'Juros ativos', natureza: 'C', subcontas: [] },
          { id: 532, codigo: '5.3.2', descricao: 'Descontos obtidos', natureza: 'C', subcontas: [] },
        ],
      },
    ],
  },
];

/* ========= Opções p/ <select> Plano de Contas ========= */
const flatten = (nodes = []) => {
  const out = [];
  const walk = (arr) => {
    arr.forEach((n) => {
      out.push({ id: String(n.id ?? n.codigo), codigo: n.codigo, descricao: n.descricao });
      if (Array.isArray(n.subcontas) && n.subcontas.length) walk(n.subcontas);
    });
  };
  walk(nodes);
  return out;
};

export const PLANOS_OPCOES_SIMPLIFICADO = MOCK_SIMPLIFICADO.map((n) => ({
  id: n.codigo,
  descricao: `[${n.codigo}] ${n.descricao}`,
}));

export const PLANOS_OPCOES_DETALHADO = flatten(MOCK_DETALHADO).map((n) => ({
  id: n.codigo,
  descricao: `[${n.codigo}] ${n.descricao}`,
}));
