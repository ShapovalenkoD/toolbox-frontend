import { OrdersGrid, PageLayout } from "@/components";

/** Страница только размещает готовый бизнес-сценарий: загрузкой владеет feature. */
export const OrdersPage = () => {
  return (
    <PageLayout description="Последние заказы рабочего пространства." title="Заказы">
      <OrdersGrid />
    </PageLayout>
  );
};
