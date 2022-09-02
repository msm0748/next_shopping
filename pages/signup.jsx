import { useState } from "react";
import { useRouter } from "next/router";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { auth, db } from "../fBase.js";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { addDoc, collection } from "firebase/firestore";
import DaumPostcode from "react-daum-postcode";

export default function LoginPage() {
    const postCodeStyle = {
        display: "block",
        position: "fixed",
        width: "700px",
        top: "150px",
        right: "80px",
        zIndex: "100",
        border: "2px solid",
    };
    const router = useRouter();
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [phone, setPhone] = useState("");
    const [addressInfo, setAddressInfo] = useState("");
    const [detailAddressInfo, setDetailAddressInfo] = useState("");
    const [errMessage, setErrMessage] = useState("");

    const onChange = (e) => {
        const {
            target: { name, value },
        } = e;

        switch (name) {
            case "name":
                return setName(value);
            case "email":
                return setEmail(value);
            case "password":
                return setPassword(value);
            case "confirmPassword":
                return setConfirmPassword(value);
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

        setAddressInfo(fullAddress); // e.g. '서울 성동구 왕십리로2길 20 (성수동1가)'
    };

    const onSubmitHandler = async (e) => {
        e.preventDefault();

        if (name === "") {
            return alert("이름을 입력해주세요.");
        } else if (email === "") {
            return alert("이메일을 입력해주세요.");
        } else if (password === "") {
            return alert("비밀번호를 입력해주세요.");
        } else if (phone === "") {
            return alert("휴대폰번호를 입력해주세요.");
        } else if (addressInfo === "") {
            return alert("주소를 입력해주세요.");
        } else if (detailAddressInfo === "") {
            return alert("상세 주소를 입력해주세요.");
        }

        if (password !== confirmPassword) {
            return alert("비밀번호와 비밀번호 확인은 같아야 합니다.");
        }
        try {
            await createUserWithEmailAndPassword(auth, email, password);
        } catch (error) {
            const errorCode = error.code;
            const errorMessage = error.message;
            setErrMessage(errorCode);
            return;
        }
        try {
            await addDoc(collection(db, "user"), {
                name,
                email,
                phone,
                addressInfo,
                detailAddressInfo,
                createdAt: Date.now(),
            });
            alert("회원가입에 성공했습니다.");
            router.push("/");
        } catch (err) {
            console.log(err);
        }
    };
    return (
        <Form onSubmit={onSubmitHandler}>
            <DaumPostcode
                onComplete={handleComplete}
                style={postCodeStyle}
                height={700}
            />
            <Form.Group className="mb-3" controlId="formBasicEmail">
                <Form.Label>이메일</Form.Label>
                <Form.Control
                    type="email"
                    name="email"
                    placeholder="이메일"
                    value={email}
                    onChange={onChange}
                />
                <Form.Text className="text-muted">
                    귀하의 이메일을 다른 사람과 공유하지 않습니다.
                </Form.Text>
            </Form.Group>
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
                <Form.Label>비밀번호 확인</Form.Label>
                <Form.Control
                    type="password"
                    name="confirmPassword"
                    placeholder="비밀번호 확인"
                    value={confirmPassword}
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
                회원가입
            </Button>
        </Form>
    );
}
