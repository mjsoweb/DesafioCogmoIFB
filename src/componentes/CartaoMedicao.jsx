import { Card, Statistic, Typography } from "antd";

const { Text } = Typography;

function CartaoMedicao(props) {
  return (
    <Card>
      <Statistic
        title={props.titulo}
        value={props.valor}
        suffix={props.unidade}
      />

      <Text type="secondary">
        Horário: {props.horario}
      </Text>
    </Card>
  );
}

export default CartaoMedicao;