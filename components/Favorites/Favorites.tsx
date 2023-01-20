import { Item } from "@store/types/item";
import Link from "next/link";
import Image from "next/image";
import { FavoritesStyles } from "./Favorites.styles";

interface FavoritesProps {
  items: Item[];
}

function Favorites({ items }: FavoritesProps) {
  return (
    <FavoritesStyles>
      <div className="items-inner">
        {!items.length && (
          <h2 className="no-items">
            You don't have any items added to favorites.{" "}
          </h2>
        )}

        {items.map((item) => (
          <div className="item" key={item.id}>
            <div className="item-image">
              <Link href={`shop/${item.id}`}>
                <Image
                  src={item.images[0]}
                  alt="Photo"
                  fill
                  objectFit="cover"
                />
              </Link>
            </div>
            <div className="bar">
              <div className="hero">
                <div className="item-price">{item.price} PLN</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </FavoritesStyles>
  );
}

export default Favorites;
