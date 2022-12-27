import { Item } from "@store/types/item";
import { ProfileItemsStyles } from "./ProfileItems.styles";
import Image from "next/image";
import TrashCan from "@public/images/trash.svg";
import Link from "next/link";

interface ProfileItemsProps {
  items: Item[];
}

const ProfileItems = ({ items }: ProfileItemsProps) => {
  return (
    <ProfileItemsStyles>
      {items.map((item) => (
        <div className="item" key={item.id}>
          <div className="item-image">
            <Image src={item.images[0]} alt="Photo" fill objectFit="cover" />
          </div>
          <div className="bar">
            <Link href={`/edit/${item.id}`}>
              <p className="edit">Edit</p>
            </Link>
            <Image src={TrashCan} alt="Delete" height={20} width={20} />
          </div>
        </div>
      ))}
    </ProfileItemsStyles>
  );
};

export default ProfileItems;
