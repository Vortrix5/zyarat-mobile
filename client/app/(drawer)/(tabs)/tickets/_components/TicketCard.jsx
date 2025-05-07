import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal } from 'react-native';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
// Import the QR Code component
import QRCode from 'react-native-qrcode-svg';

// Assuming Ticket type is imported or defined here
interface Ticket {
  id: string;
  eventId: string;
  title: string;
  imageUrl?: string;
  location?: string;
  purchaseDate: Date;
  eventDate: Date;
  price: string | number;
  qrCodeData: string;
}

interface TicketCardProps {
  ticket: Ticket;
}

const TicketCard = React.memo(({ ticket }: TicketCardProps) => {
  const [qrModalVisible, setQrModalVisible] = useState(false);

  const displayPrice = typeof ticket.price === 'number' ? `${ticket.price} TND` : ticket.price;
  const formattedEventDate = ticket.eventDate.toLocaleDateString();
  const formattedPurchaseDate = ticket.purchaseDate.toLocaleDateString();

  return (
    <View style={styles.card}>
      <Image
        source={{ uri: ticket.imageUrl || 'https://via.placeholder.com/150' }}
        style={styles.image}
        contentFit="cover"
      />
      <View style={styles.content}>
        <Text style={styles.title}>{ticket.title}</Text>

        <View style={styles.detailRow}>
          <Ionicons name="calendar-outline" size={16} color="#555" />
          <Text style={styles.detailText}>Event Date: {formattedEventDate}</Text>
        </View>

        <View style={styles.detailRow}>
          <Ionicons name="location-outline" size={16} color="#555" />
          <Text style={styles.detailText}>{ticket.location || 'N/A'}</Text>
        </View>

        <View style={styles.detailRow}>
          <Ionicons name="pricetag-outline" size={16} color="#555" />
          <Text style={styles.detailText}>Price: {displayPrice}</Text>
        </View>

        <View style={styles.detailRow}>
          <Ionicons name="receipt-outline" size={16} color="#555" />
          <Text style={styles.detailText}>Purchased: {formattedPurchaseDate}</Text>
        </View>

        <TouchableOpacity style={styles.qrButton} onPress={() => setQrModalVisible(true)}>
          <Ionicons name="qr-code-outline" size={20} color="#007AFF" />
          <Text style={styles.qrButtonText}>Show QR Code</Text>
        </TouchableOpacity>
      </View>

      {/* QR Code Modal */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={qrModalVisible}
        onRequestClose={() => setQrModalVisible(false)}
      >
        <TouchableOpacity
          style={styles.modalBackground}
          activeOpacity={1}
          onPressOut={() => setQrModalVisible(false)} // Close on background press
        >
          <View style={styles.qrModalContent} onStartShouldSetResponder={() => true}>
            <Text style={styles.qrModalTitle}>Scan for Entry</Text>
            {/* Replace placeholder with actual QR Code component */}
            <View style={styles.qrCodeContainer}>
              <QRCode
                value={ticket.qrCodeData || 'NoData'} // Use ticket data, provide fallback
                size={200} // Adjust size as needed
                backgroundColor="white" // Ensure background is white
                color="black" // Standard black QR code
              />
            </View>
            <Text style={styles.qrCodeDataText}>ID: {ticket.qrCodeData}</Text>
            <TouchableOpacity onPress={() => setQrModalVisible(false)} style={styles.closeModalButton}>
              <Text style={styles.closeModalText}>Close</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
});

export default TicketCard;

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    marginBottom: 15,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    flexDirection: 'row', // Arrange image and content side-by-side
  },
  image: {
    width: 100, // Fixed width for the image
    height: '100%', // Take full height of the card
  },
  content: {
    flex: 1, // Take remaining space
    padding: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333',
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  detailText: {
    fontSize: 13,
    color: '#555',
    marginLeft: 6,
    flexShrink: 1, // Allow text to wrap
  },
  qrButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    paddingVertical: 6,
    paddingHorizontal: 10,
    backgroundColor: '#eef6ff',
    borderRadius: 6,
    alignSelf: 'flex-start', // Align button to the left
  },
  qrButtonText: {
    color: '#007AFF',
    fontSize: 13,
    fontWeight: '600',
    marginLeft: 5,
  },
  // QR Modal Styles
  modalBackground: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  qrModalContent: {
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 25,
    alignItems: 'center',
    width: '80%',
  },
  qrModalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20, // Increased margin
  },
  qrCodeContainer: {
    padding: 10, // Add padding around the QR code
    backgroundColor: 'white', // Ensure white background behind QR
    borderRadius: 8, // Optional: slightly rounded corners for the container
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  qrCodeDataText: {
    fontSize: 11,
    color: '#888', // Lighter color
    marginTop: 10, // Space above
    textAlign: 'center',
    paddingHorizontal: 10,
  },
  closeModalButton: {
    marginTop: 20, // Increased margin
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  closeModalText: {
    fontSize: 16,
    color: '#007AFF',
    fontWeight: '600',
  },
});
