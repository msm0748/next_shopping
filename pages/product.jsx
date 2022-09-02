import { getStorage, ref } from "firebase/storage";

export default function Product() {
    const storage = getStorage();
    return (
        <>
            <form>
                제품명 <input type="text" />
                가격 <input type="number" />
                분류 <input type="text" />
                내용 <input type="text" />
                이미지 <input type="file" id="image" />
            </form>
        </>
    );
}
