'use client';

import { useState, useEffect } from 'react';
import { Box, Flex, VStack, Heading, Text, Grid, GridItem, Button, useColorModeValue, Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton, useDisclosure, FormControl, FormLabel, Input, Select } from '@chakra-ui/react';
import axios from 'axios';

interface Otopark {
  _id: string;
  ad: string;
  kapasite: number;
  mevcutAracSayisi: number;
}

interface Kullanici {
  _id: string;
  ad: string;
  soyad: string;
  email: string;
}

interface AracDurumu {
  _id: string;
  kullaniciId: string;
  otoparkId: string;
  girisTarihi: Date;
  cikisTarihi: Date | null;
}

export default function Dashboard() {
  const [otoparklar, setOtoparklar] = useState<Otopark[]>([]);
  const [kullanicilar, setKullanicilar] = useState<Kullanici[]>([]);
  const [aracDurumlari, setAracDurumlari] = useState<AracDurumu[]>([]);
  const [yeniOtopark, setYeniOtopark] = useState({ ad: '', kapasite: '' });
  const [yeniKullanici, setYeniKullanici] = useState({ ad: '', soyad: '', email: '' });
  const [yeniAracDurumu, setYeniAracDurumu] = useState({ kullaniciId: '', otoparkId: '' });

  const { isOpen: isOtoparkModalOpen, onOpen: onOtoparkModalOpen, onClose: onOtoparkModalClose } = useDisclosure();
  const { isOpen: isKullaniciModalOpen, onOpen: onKullaniciModalOpen, onClose: onKullaniciModalClose } = useDisclosure();
  const { isOpen: isAracDurumuModalOpen, onOpen: onAracDurumuModalOpen, onClose: onAracDurumuModalClose } = useDisclosure();

  const bgColor = useColorModeValue('gray.50', 'gray.900');
  const cardBgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const otoparkResponse = await axios.get<Otopark[]>('/api/otoparklar');
    const kullaniciResponse = await axios.get<Kullanici[]>('/api/kullanicilar');
    const aracDurumuResponse = await axios.get<AracDurumu[]>('/api/arac-durumlari');

    setOtoparklar(otoparkResponse.data);
    setKullanicilar(kullaniciResponse.data);
    setAracDurumlari(aracDurumuResponse.data);
  };

  const handleOtoparkEkle = async () => {
    await axios.post('/api/otoparklar', yeniOtopark);
    setYeniOtopark({ ad: '', kapasite: '' });
    onOtoparkModalClose();
    fetchData();
  };

  const handleKullaniciEkle = async () => {
    await axios.post('/api/kullanicilar', yeniKullanici);
    setYeniKullanici({ ad: '', soyad: '', email: '' });
    onKullaniciModalClose();
    fetchData();
  };

  const handleAracDurumuEkle = async () => {
    await axios.post('/api/arac-durumlari', { ...yeniAracDurumu, girisTarihi: new Date() });
    setYeniAracDurumu({ kullaniciId: '', otoparkId: '' });
    onAracDurumuModalClose();
    fetchData();
  };

  return (
    <Box maxWidth="1200px" margin="auto" padding={8} bg={bgColor} minHeight="100vh">
      <VStack spacing={8} align="stretch">
        <Heading as="h1" size="2xl" textAlign="center" mb={6}>Otopark Yönetim Paneli</Heading>
        
        <Grid templateColumns="repeat(3, 1fr)" gap={6}>
          <GridItem colSpan={1}>
            <Box bg={cardBgColor} p={5} borderRadius="lg" boxShadow="md" border="1px" borderColor={borderColor}>
              <Heading size="md" mb={4}>Otoparklar</Heading>
              {otoparklar.map(otopark => (
                <Box key={otopark._id} mb={3} p={3} bg={useColorModeValue('gray.100', 'gray.700')} borderRadius="md">
                  <Text fontWeight="bold">{otopark.ad}</Text>
                  <Text>Kapasite: {otopark.kapasite}</Text>
                  <Text>Mevcut Araç: {otopark.mevcutAracSayisi}</Text>
                </Box>
              ))}
              <Button mt={4} colorScheme="blue" onClick={onOtoparkModalOpen}>Otopark Ekle</Button>
            </Box>
          </GridItem>
          
          <GridItem colSpan={1}>
            <Box bg={cardBgColor} p={5} borderRadius="lg" boxShadow="md" border="1px" borderColor={borderColor}>
              <Heading size="md" mb={4}>Kullanıcılar</Heading>
              {kullanicilar.slice(0, 5).map(kullanici => (
                <Box key={kullanici._id} mb={2} p={2} bg={useColorModeValue('gray.100', 'gray.700')} borderRadius="md">
                  <Text>{kullanici.ad} {kullanici.soyad}</Text>
                  <Text fontSize="sm">{kullanici.email}</Text>
                </Box>
              ))}
              <Button mt={4} colorScheme="green" onClick={onKullaniciModalOpen}>Kullanıcı Ekle</Button>
            </Box>
          </GridItem>
          
          <GridItem colSpan={1}>
            <Box bg={cardBgColor} p={5} borderRadius="lg" boxShadow="md" border="1px" borderColor={borderColor}>
              <Heading size="md" mb={4}>Anlık Otopark Durumu</Heading>
              {aracDurumlari.filter(durum => !durum.cikisTarihi).map(durum => {
                const otopark = otoparklar.find(o => o._id === durum.otoparkId);
                const kullanici = kullanicilar.find(k => k._id === durum.kullaniciId);
                return (
                  <Box key={durum._id} mb={3} p={3} bg={useColorModeValue('gray.100', 'gray.700')} borderRadius="md">
                    <Text fontWeight="bold">{otopark?.ad}</Text>
                    <Text>{kullanici?.ad} {kullanici?.soyad}</Text>
                    <Text fontSize="sm">Giriş: {new Date(durum.girisTarihi).toLocaleString()}</Text>
                  </Box>
                );
              })}
              <Button mt={4} colorScheme="purple" onClick={onAracDurumuModalOpen}>Araç Girişi</Button>
            </Box>
          </GridItem>
        </Grid>
        
        <Box bg={cardBgColor} p={5} borderRadius="lg" boxShadow="md" border="1px" borderColor={borderColor}>
          <Heading size="md" mb={4}>Eşleştirme</Heading>
          <Text>Burada otopark-kullanıcı eşleştirme fonksiyonları olabilir.</Text>
        </Box>
      </VStack>

      {/* Otopark Ekleme Modal */}
      <Modal isOpen={isOtoparkModalOpen} onClose={onOtoparkModalClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Yeni Otopark Ekle</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl>
              <FormLabel>Otopark Adı</FormLabel>
              <Input value={yeniOtopark.ad} onChange={(e) => setYeniOtopark({...yeniOtopark, ad: e.target.value})} />
            </FormControl>
            <FormControl mt={4}>
              <FormLabel>Kapasite</FormLabel>
              <Input type="number" value={yeniOtopark.kapasite} onChange={(e) => setYeniOtopark({...yeniOtopark, kapasite: e.target.value})} />
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={handleOtoparkEkle}>
              Ekle
            </Button>
            <Button variant="ghost" onClick={onOtoparkModalClose}>İptal</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Kullanıcı Ekleme Modal */}
      <Modal isOpen={isKullaniciModalOpen} onClose={onKullaniciModalClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Yeni Kullanıcı Ekle</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl>
              <FormLabel>Ad</FormLabel>
              <Input value={yeniKullanici.ad} onChange={(e) => setYeniKullanici({...yeniKullanici, ad: e.target.value})} />
            </FormControl>
            <FormControl mt={4}>
              <FormLabel>Soyad</FormLabel>
              <Input value={yeniKullanici.soyad} onChange={(e) => setYeniKullanici({...yeniKullanici, soyad: e.target.value})} />
            </FormControl>
            <FormControl mt={4}>
              <FormLabel>E-posta</FormLabel>
              <Input type="email" value={yeniKullanici.email} onChange={(e) => setYeniKullanici({...yeniKullanici, email: e.target.value})} />
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="green" mr={3} onClick={handleKullaniciEkle}>
              Ekle
            </Button>
            <Button variant="ghost" onClick={onKullaniciModalClose}>İptal</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Araç Durumu Ekleme Modal */}
      <Modal isOpen={isAracDurumuModalOpen} onClose={onAracDurumuModalClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Yeni Araç Girişi</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl>
              <FormLabel>Kullanıcı</FormLabel>
              <Select placeholder="Kullanıcı seçin" value={yeniAracDurumu.kullaniciId} onChange={(e) => setYeniAracDurumu({...yeniAracDurumu, kullaniciId: e.target.value})}>
                {kullanicilar.map(kullanici => (
                  <option key={kullanici._id} value={kullanici._id}>{kullanici.ad} {kullanici.soyad}</option>
                ))}
              </Select>
            </FormControl>
            <FormControl mt={4}>
              <FormLabel>Otopark</FormLabel>
              <Select placeholder="Otopark seçin" value={yeniAracDurumu.otoparkId} onChange={(e) => setYeniAracDurumu({...yeniAracDurumu, otoparkId: e.target.value})}>
                {otoparklar.map(otopark => (
                  <option key={otopark._id} value={otopark._id}>{otopark.ad}</option>
                ))}
              </Select>
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="purple" mr={3} onClick={handleAracDurumuEkle}>
              Giriş Yap
            </Button>
            <Button variant="ghost" onClick={onAracDurumuModalClose}>İptal</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
}