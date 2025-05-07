import React, { useState, useEffect, useMemo } from 'react';
import { View, Text, StyleSheet, FlatList, SafeAreaView } from 'react-native';
import { useFocusEffect } from 'expo-router';
import { Ionicons } from '@expo/vector-icons'; // Import Ionicons
import { useTickets } from '../../../../contexts/TicketsContext';
import TicketFilter from './_components/TicketFilter';
import TicketCard from './_components/TicketCard';

export default function TicketsScreen() {
    const { tickets, newTicketCount, resetNewTicketCount } = useTickets();
    const [selectedFilter, setSelectedFilter] = useState('All');

    // Reset new ticket count when the screen comes into focus
    useFocusEffect(
        React.useCallback(() => {
            if (newTicketCount > 0) {
                resetNewTicketCount();
            }
        }, [newTicketCount, resetNewTicketCount])
    );

    const filteredTickets = useMemo(() => {
        const now = new Date();
        now.setHours(0, 0, 0, 0); // Set to beginning of today for comparison

        if (selectedFilter === 'Upcoming') {
            return tickets.filter(ticket => ticket.eventDate >= now);
        }
        if (selectedFilter === 'Past') {
            return tickets.filter(ticket => ticket.eventDate < now);
        }
        return tickets; // 'All'
    }, [tickets, selectedFilter]);

    // Sort tickets by event date (most recent first for Past, soonest first for Upcoming/All)
    const sortedTickets = useMemo(() => {
        return [...filteredTickets].sort((a, b) => {
             if (selectedFilter === 'Past') {
                 return b.eventDate.getTime() - a.eventDate.getTime(); // Descending for Past
             }
             return a.eventDate.getTime() - b.eventDate.getTime(); // Ascending for Upcoming/All
         });
    }, [filteredTickets, selectedFilter]);


    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.container}>
                <TicketFilter
                    selectedFilter={selectedFilter}
                    onSelectFilter={setSelectedFilter}
                />
                <FlatList
                    data={sortedTickets}
                    renderItem={({ item }) => <TicketCard ticket={item} />}
                    keyExtractor={(item) => item.id}
                    contentContainerStyle={styles.listContent}
                    ListEmptyComponent={
                        <View style={styles.emptyContainer}>
                            <Ionicons name="ticket-outline" size={60} color="#ccc" />
                            <Text style={styles.emptyText}>
                                {tickets.length === 0
                                    ? "You haven't purchased any tickets yet."
                                    : "No tickets match the selected filter."}
                            </Text>
                            {tickets.length === 0 && (
                                <Text style={styles.emptySubText}>
                                    Try exploring events and attractions!
                                </Text>
                            )}
                        </View>
                    }
                />
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#f8f9fa', // Match explore background
    },
    container: {
        flex: 1,
    },
    listContent: {
        paddingHorizontal: 15,
        paddingBottom: 20,
        flexGrow: 1, // Ensure container grows to allow centering empty component
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
        marginTop: -50, // Adjust position slightly if needed
    },
    emptyText: {
        fontSize: 17,
        color: '#666',
        textAlign: 'center',
        marginTop: 15, // Space below icon
        fontWeight: '500',
    },
    emptySubText: {
        fontSize: 14,
        color: '#888',
        textAlign: 'center',
        marginTop: 8,
    },
});
