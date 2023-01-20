import { Order } from "@stripe/stripe-js";
import { OrderedItemsStyles } from "./OrderedItems.styles";
import { OrderStatuses } from "./order-status";
import Image from "next/image";
import SettingsDots from "@public/images/settings-dots.svg";
import { useState } from "react";
import CustomModal from "@components/CustomModal/CustomModal";

interface OrderedItemsProps {
  items: Order[];
}

function OrderedItems({ items }: OrderedItemsProps) {
  const [statusModalIsOpen, setStatusModalIsOpen] = useState(false);
  const [destinationModalIsOpen, setDestinationModalIsOpen] = useState(false);

  const setAsReceived = () => {
    setStatusModalIsOpen(false);
    console.log("hey submiting modal");
  };

  const openStatusModal = () => {
    setStatusModalIsOpen(true);
  };

  const openDestinationInfo = () => {
    setDestinationModalIsOpen(true);
  };

  return (
    <OrderedItemsStyles>
      <CustomModal
        actionName="Submit"
        subtitle="You can not change it back"
        isOpen={statusModalIsOpen}
        onSubmit={setAsReceived}
        setIsOpen={setStatusModalIsOpen}
        title="Set as received?"
      />
      <CustomModal
        subtitle="Adress is Mashonka 33"
        isOpen={destinationModalIsOpen}
        setIsOpen={setDestinationModalIsOpen}
        title="Destination info"
      />
      {items.length ? (
        <p className="no-items">You haven't ordered anything</p>
      ) : (
        <>
          <div className="bar">
            <p className="bar-label">Order ID</p>
            <p className="bar-label">Date</p>
            <p className="bar-label">Customer</p>
            <p className="bar-label">Item</p>
            <p className="bar-label">Destination</p>
            <p className="bar-label">Status</p>
          </div>
          <div className="order">
            <p className="order-info">#54854</p>
            <p className="order-info">08/11/2022</p>
            <p className="order-info link">See profile</p>
            <p className="order-info link">See item</p>
            <p className="order-info link" onClick={openDestinationInfo}>
              See info
            </p>
            <p className="order-info">
              <div className="status">
                <div
                  className="status-bg"
                  style={{
                    backgroundColor: OrderStatuses[1].color,
                  }}
                ></div>
                <div
                  className="status-inner"
                  style={{
                    color: OrderStatuses[1].color,
                  }}
                >
                  {OrderStatuses[1].label}
                </div>
              </div>
              <div className="order-settings">
                <Image src={SettingsDots} alt="Settings" draggable={false} />
                <div className="order-tab">
                  <div className="order-tab__item" onClick={openStatusModal}>
                    Set as received
                  </div>
                </div>
              </div>
            </p>
          </div>
          {items.map((order) => (
            <div className="order"></div>
          ))}
        </>
      )}
    </OrderedItemsStyles>
  );
}
export default OrderedItems;
