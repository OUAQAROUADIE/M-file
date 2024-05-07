import React from 'react';
import {Navbar, Nav, Container, Card} from 'react-bootstrap';
import homeImage from "./home2r.png"; // Importer l'image
import "./style.css"

const Accueil = () => {
    return (
        <>
            <Navbar bg="light" expand="lg">
                <Container>
                    <img src="./logo.png" className="logo"/>
                    <Navbar.Brand href="." >M-File</Navbar.Brand>
                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse id="basic-navbar-nav">.
                        <Nav className="ml-auto">
                            <button type="button" className="btn btn1 btn-success" onClick={() => window.location.href="/login"}>Connexion</button>
                            <button type="button" className="btn btn1 btn-success"onClick={() => window.location.href="/register"} >Inscription</button>
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>
            <Container className="mt-5 d-flex data">
                <div className="mt-5">
                    <h3 className="mt-5">Bienvenue sur notre plateforme de stockage et de gestion de fichiers dans le cloud !</h3>
                    <p className="mt-3">
                        Notre service  vous offre une solution efficace pour stocker, organiser et partager vos fichiers en toute sécurité.
                         Que vous soyez un professionnel cherchant à optimiser la gestion de ses documents ou un particulier souhaitant sauvegarder 
                         ses souvenirs les plus précieux, notre plateforme est conçue pour répondre à vos besoins.
                    </p>
                    <button type="button" className="btn btn-success" onClick={() => window.location.href="/login"} >Get Started</button>
                </div>
                    <img src={homeImage} className="home-img" alt="Accueil" />
            </Container>
            <Container className="text-center mb-5">
            <h3 className="text-center mb-5">Notre Avantages</h3>
            <Container className="cards mt-5 d-flex justify-content-between ">
                <Card className="mb-3 m-lg-1" onClick={() => window.location.href="/login"} >
                    <Card.Body>
                        <Card.Title>Stockage Illimité</Card.Title>
                        <Card.Text>
                            Profitez d'un stockage illimité pour sauvegarder tous vos fichiers sans vous soucier de l'espace disponible.</Card.Text>
                        <Card.Text className="text-muted">À partir de 9,99€/mois</Card.Text>
                    </Card.Body>
                </Card>
                <Card className="mb-3 m-lg-1" onClick={() => window.location.href="/login"}>
                    <Card.Body>
                        <Card.Title>Sécurité Renforcée</Card.Title>
                        <Card.Text>
                            Bénéficiez d'une sécurité renforcée pour protéger vos fichiers sensibles contre les menaces en ligne. </Card.Text>
                        <Card.Text className="text-muted">À partir de 14,99€/mois</Card.Text>
                    </Card.Body>
                </Card>
                <Card className="mb-3 m-lg-1" onClick={() => window.location.href="/login"}>
                    <Card.Body>
                        <Card.Title>Partage Facile</Card.Title>
                        <Card.Text>
                            Partagez facilement vos fichiers avec vos collègues, amis ou famille, et collaborez en temps réel sur vos projets. </Card.Text>
                        <Card.Text className="text-muted">À partir de 19,99€/mois</Card.Text>
                    </Card.Body>
                </Card>
            </Container>
            </Container>
            <footer className="footer mt-auto py-3 text-center bg-success">
                <div className="container">
                                                <span className="text-muted">© 2024 M-File, Inc. Tous droits réservés.</span>
                             </div>
            </footer>
        </>
    );
};

export default Accueil;
