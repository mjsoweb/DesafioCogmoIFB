import { Alert } from "antd";

function AvisoSimulacao() {
  return (
    <Alert
      message="Dados de demonstração"
      description="Todas as medições exibidas são fictícias e foram criadas para esta Sprint 2. Não representam observações hidrológicas reais."
      type="warning"
      showIcon
    />
  );
}

export default AvisoSimulacao;