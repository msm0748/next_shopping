import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import Offcanvas from "react-bootstrap/Offcanvas";
import Link from "next/link";
import { useState, useEffect } from "react";
import { auth } from "../../fBase";
import { onAuthStateChanged, signOut } from "firebase/auth";

function Navigation() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const onLogOutClick = (e) => {
    e.preventDefault();
    signOut(auth);
  };
  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      // console.log(user);
      if (user) {
        setIsLoggedIn(true);
      } else {
        setIsLoggedIn(false);
      }
    });
  }, []);
  return (
    <>
      <Navbar key="md" bg="light" expand="md" className="mb-3 py-4">
        <Container>
          <Link href="/">
            <Navbar.Brand href="/">
              <img
                src="https://shop-phinf.pstatic.net/20220317_219/1647513922878LIqGf_PNG/48649706386860485_782297321.png?type=m120"
                alt="로고"
                style={{ width: "70px" }}
                className="rounded-circle"
              />
            </Navbar.Brand>
          </Link>
          <Navbar.Toggle aria-controls={`offcanvasNavbar-expand-md`} />
          <Navbar.Offcanvas
            id={`offcanvasNavbar-expand-md`}
            aria-labelledby={`offcanvasNavbarLabel-expand-md`}
            placement="end"
          >
            <Offcanvas.Header closeButton>
              <Offcanvas.Title id={`offcanvasNavbarLabel-expand-md`}>Offcanvas</Offcanvas.Title>
            </Offcanvas.Header>
            <Offcanvas.Body>
              <Nav className="justify-content-end flex-grow-1">
                <Link href="/">
                  <Nav.Link className="mx-2" href="/">
                    Home
                  </Nav.Link>
                </Link>
                <Link href="/shop">
                  <Nav.Link className="mx-2" href="/shop">
                    Shop
                  </Nav.Link>
                </Link>
                <Link href="/about">
                  <Nav.Link className="mx-2" href="/about">
                    About
                  </Nav.Link>
                </Link>
                <Link href="/review">
                  <Nav.Link className="mx-2" href="/review">
                    Review
                  </Nav.Link>
                </Link>
                <Link href="/qna">
                  <Nav.Link className="mx-2" href="/qna">
                    Q&A
                  </Nav.Link>
                </Link>
                {isLoggedIn ? (
                  <>
                    <Nav.Link className="mx-2" onClick={onLogOutClick}>
                      logOut
                    </Nav.Link>
                    <Link href="/myPage">
                      <Nav.Link className="mx-2" href="/myPage">
                        MyPage
                      </Nav.Link>
                    </Link>
                    <Link href="/cart">
                      <Nav.Link className="ml-2" href="/cart">
                        Cart
                      </Nav.Link>
                    </Link>
                  </>
                ) : (
                  <Link href="/login">
                    <Nav.Link className="mx-2" href="/login">
                      logIn
                    </Nav.Link>
                  </Link>
                )}
              </Nav>
            </Offcanvas.Body>
          </Navbar.Offcanvas>
        </Container>
      </Navbar>
    </>
  );
}

export default Navigation;
