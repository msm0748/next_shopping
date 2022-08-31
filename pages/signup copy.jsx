import { useState } from "react";
import { useRouter } from "next/router";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Container from "react-bootstrap/Container";
import { auth, db } from "../fBase.js";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { addDoc, collection } from "firebase/firestore";

export default function LoginPage() {
    const router = useRouter();
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [phone, setPhone] = useState("");
    const [addressInfo, setAddressInfo] = useState("");
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
            default:
                return;
        }
    };

    const onSubmitHandler = async (e) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            return alert("비밀번호와 비밀번호 확인은 같아야 합니다.");
        }
        await createUserWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                const user = userCredential.user;
                updateProfile(user, {
                    displayName: name,
                })
                    .then(() => {
                        addDoc(collection(db, "user"), {
                            name,
                            email,
                            phone,
                            addressInfo,
                            createdAt: Date.now(),
                        });
                        alert("회원가입에 성공했습니다.");
                        router.push("/");
                    })
                    .catch((error) => {
                        console.log(error);
                    });
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                setErrMessage(errorCode);
            });
    };
    return (
        <Container>
            <Form onSubmit={onSubmitHandler}>
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
                    />
                </Form.Group>
                <div>{errMessage}</div>
                <Button variant="primary" type="submit">
                    회원가입
                </Button>
            </Form>
        </Container>
    );
}
