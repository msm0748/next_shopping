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

        setAddressInfo(fullAddress); // e.g. '?????? ????????? ????????????2??? 20 (?????????1???)'
    };

    const onSubmitHandler = async (e) => {
        e.preventDefault();

        if (name === "") {
            return alert("????????? ??????????????????.");
        } else if (email === "") {
            return alert("???????????? ??????????????????.");
        } else if (password === "") {
            return alert("??????????????? ??????????????????.");
        } else if (phone === "") {
            return alert("?????????????????? ??????????????????.");
        } else if (addressInfo === "") {
            return alert("????????? ??????????????????.");
        } else if (detailAddressInfo === "") {
            return alert("?????? ????????? ??????????????????.");
        }

        if (password !== confirmPassword) {
            return alert("??????????????? ???????????? ????????? ????????? ?????????.");
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
            alert("??????????????? ??????????????????.");
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
                <Form.Label>?????????</Form.Label>
                <Form.Control
                    type="email"
                    name="email"
                    placeholder="?????????"
                    value={email}
                    onChange={onChange}
                />
                <Form.Text className="text-muted">
                    ????????? ???????????? ?????? ????????? ???????????? ????????????.
                </Form.Text>
            </Form.Group>
            <Form.Group className="mb-3" controlId="formBasicPassword">
                <Form.Label>??????</Form.Label>
                <Form.Control
                    type="text"
                    name="name"
                    placeholder="??????"
                    value={name}
                    onChange={onChange}
                />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formBasicPassword">
                <Form.Label>????????? ??????</Form.Label>
                <Form.Control
                    type="number"
                    name="phone"
                    placeholder="????????? ??????"
                    value={phone}
                    onChange={onChange}
                />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formBasicPassword">
                <Form.Label>????????????</Form.Label>
                <Form.Control
                    type="password"
                    name="password"
                    placeholder="????????????"
                    value={password}
                    onChange={onChange}
                />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formBasicPassword">
                <Form.Label>???????????? ??????</Form.Label>
                <Form.Control
                    type="password"
                    name="confirmPassword"
                    placeholder="???????????? ??????"
                    value={confirmPassword}
                    onChange={onChange}
                />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formBasicPassword">
                <Form.Label>?????????</Form.Label>
                <Form.Control
                    type="text"
                    name="addressInfo"
                    placeholder="??????"
                    value={addressInfo}
                    onChange={onChange}
                    disabled
                />
                <Form.Control
                    type="text"
                    name="detailAddressInfo"
                    placeholder="?????? ??????"
                    value={detailAddressInfo}
                    onChange={onChange}
                />
            </Form.Group>
            <div style={{ color: "red" }}>{errMessage}</div>
            <Button variant="primary" type="submit">
                ????????????
            </Button>
        </Form>
    );
}
