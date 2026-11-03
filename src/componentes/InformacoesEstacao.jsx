import { Card, Typography } from "antd";

const { Text } = Typography;

// Identificação da estação: nome, rio e município recebidos por props.
function InformacoesEstacao(props) {
  return (
    <Card title={props.nome}>
      <div>
        <Text strong>Rio: </Text>
        <Text>{props.rio}</Text>
      </div>
      <div>
        <Text strong>Município: </Text>
        <Text>{props.municipio}</Text>
      </div>
    </Card>
  );
}

export default InformacoesEstacao;