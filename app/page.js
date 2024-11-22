'use client';

import '../styles/globals.css';
import { Container, Button } from 'react-bootstrap';
import Image from 'next/image';
import Link from 'next/link';

export default function HomePage() {
  return (
    <Container className="mt-5 text-center">
      <div className="logo-img">
        <Image
          src="/imgs/stellatosMarketLogo.png"
          alt="Stellatos Market Logo"
          width={200}
          height={100}
        />
      </div>
      <h1 className="mt-4">Welcome to Stellatos Market!</h1>
      <p className="mt-3">
        Discover the best fresh produce, groceries, and more at Stellatos
        Market.
      </p>
      <Link href="/placeOrder" passHref>
        <Button variant="primary" className="mt-3">
          Start Shopping
        </Button>
      </Link>
    </Container>
  );
}
