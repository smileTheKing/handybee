# Chat Messaging System

This directory contains the chat messaging system for HandleBee, allowing users to communicate about their orders.

## Components

### ChatPage
The main chat interface that combines conversation list and message view.

### ConversationList
Displays all user conversations with search functionality and unread message indicators.

### ChatMessages
Shows messages for a specific conversation with real-time messaging capabilities.

### ChatNotification
A notification component that shows unread message count in the header.

## API Routes

### `/api/messages`
- `GET`: Fetch messages for a specific order
- `POST`: Create a new message

### `/api/conversations`
- `GET`: Fetch all user conversations

## Features

- Real-time messaging between buyers and sellers
- Conversation search and filtering
- Unread message indicators
- Mobile-responsive design
- Message timestamps
- User avatars and names
- Order status integration

## Usage

1. Users can access chat via `/chat` route
2. Messages are tied to specific orders
3. Only order participants can access the conversation
4. Chat notifications appear in the header for authenticated users

## Database Schema

Messages are stored in the `Message` table with relationships to:
- `Order` (the order being discussed)
- `User` (sender and receiver)

## Security

- All API routes require authentication
- Users can only access conversations for orders they're involved in
- Message content is validated and sanitized 