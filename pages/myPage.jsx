import { useRouter } from "next/router";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import DaumPostcode from "react-daum-postcode";
import { useEffect, useState } from "react";
import { db } from "../fBase";
import { doc, updateDoc } from "firebase/firestore";
import { useSelector, useDispatch } from "react-redux";
import { getUserInfo } from "../store/userSlice";

export default function About() {
    const user = useSelector((state) => state.user.user);
    const dispatch = useDispatch();
    const router = useRouter();
    const [name, setName] = useState("");
    const [password, setPassword] = useState("");
    const [phone, setPhone] = useState("");
    const [addressInfo, setAddressInfo] = useState("");
    const [detailAddressInfo, setDetailAddressInfo] = useState("");
    const [errMessage, setErrMessage] = useState("");
    const postCodeStyle = {
        display: "block",
        position: "fixed",
        width: "700px",
        top: "150px",
        right: "80px",
        zIndex: "100",
        border: "2px solid",
    };
    useEffect(() => {
        console.log(user, "마이페이지");
        if (user) {
            setName(user.name);
            setPhone(user.phone);
            setAddressInfo(user.addressInfo);
            setDetailAddressInfo(user.detailAddressInfo);
        }
    }, [user]);
    const onChange = (e) => {
        const {
            target: { name, value },
        } = e;

        switch (name) {
            case "name":
                return setName(value);
            case "password":
                return setPassword(value);
            case "phone":
                return setPhone(value);
            case "addressInfo":
                return setAddressInfo(value);
            case "detailAddressInfo":
                return setDetailAddressInfo(value);
        }
    };

    const handleComplete = (data) => {
        let fullAddress = data.address;
        let extraAddress = "";

        if (data.addressType === "R") {
            if (data.bname !== "") {
                extraAddress += data.bname;
            }
            if (data.buildingName !== "") {
                extraAddress +=
                    extraAddress !== ""
                        ? `, ${data.buildingName}`
                        : data.buildingName;
            }
            fullAddress += extraAddress !== "" ? ` (${extraAddress})` : "";
        }

        setAddressInfo(fullAddress);
    };

    const onSubmitHandler = async (e) => {
        e.preventDefault();

        if (name === "") {
            return alert("이름을 입력해주세요.");
        } else if (password === "") {
            return alert("비밀번호를 입력해주세요.");
        } else if (phone === "") {
            return alert("휴대폰번호를 입력해주세요.");
        } else if (addressInfo === "") {
            return alert("주소를 입력해주세요.");
        } else if (detailAddressInfo === "") {
            return alert("상세 주소를 입력해주세요.");
        }

        updateDoc(doc(db, "user", user.docId), {
            name,
            phone,
            addressInfo,
            detailAddressInfo,
            createdAt: Date.now(),
        })
            .then(() => {
                dispatch(
                    getUserInfo({
                        ...user,
                        name,
                        phone,
                        addressInfo,
                        detailAddressInfo,
                    })
                );
                alert("개인 정보 수정이 완료되었습니다.");
                router.push("/");
            })
            .catch((err) => setErrMessage(err));
    };

    return (
        <>
            <Form onSubmit={onSubmitHandler}>
                <DaumPostcode
                    onComplete={handleComplete}
                    style={postCodeStyle}
                    height={700}
                />
                <Form.Group className="mb-3" controlId="formBasicPassword">
                    <Form.Label>이름</Form.Label>
                    <Form.Control
                        type="text"
                        name="name"
                        placeholder="이름"
                        value={name}
                        onChange={onChange}
                    />
                </Form.Group>
                <Form.Group className="mb-3" controlId="formBasicPassword">
                    <Form.Label>휴대폰 번호</Form.Label>
                    <Form.Control
                        type="number"
                        name="phone"
                        placeholder="휴대폰 번호"
                        value={phone}
                        onChange={onChange}
                    />
                </Form.Group>
                <Form.Group className="mb-3" controlId="formBasicPassword">
                    <Form.Label>비밀번호</Form.Label>
                    <Form.Control
                        type="password"
                        name="password"
                        placeholder="비밀번호"
                        value={password}
                        onChange={onChange}
                    />
                </Form.Group>
                <Form.Group className="mb-3" controlId="formBasicPassword">
                    <Form.Label>집주소</Form.Label>
                    <Form.Control
                        type="text"
                        name="addressInfo"
                        placeholder="주소"
                        value={addressInfo}
                        onChange={onChange}
                        disabled
                    />
                    <Form.Control
                        type="text"
                        name="detailAddressInfo"
                        placeholder="상세 주소"
                        value={detailAddressInfo}
                        onChange={onChange}
                    />
                </Form.Group>
                <div style={{ color: "red" }}>{errMessage}</div>
                <Button variant="primary" type="submit">
                    정보 수정
                </Button>
            </Form>
        </>
    );
}
