import Container from "react-bootstrap/Container";
import Gnb from "../Gnb";
import Auth from "../Auth";

export default function Layout({ children }) {
    return (
        <>
            <Auth />
            <Gnb />
            <Container>{children}</Container>
        </>
    );
}
