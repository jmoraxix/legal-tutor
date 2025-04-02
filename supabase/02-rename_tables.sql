-- SQL to rename tables from messages to chat_messages and conversations to chat_sessions

-- Rename tables
ALTER TABLE messages RENAME TO chat_messages;
ALTER TABLE conversations RENAME TO chat_sessions;

-- First drop the existing foreign key constraint
ALTER TABLE chat_messages DROP CONSTRAINT messages_conversation_id_fkey;

-- Rename the conversation_id column in chat_messages table
ALTER TABLE chat_messages RENAME COLUMN conversation_id TO chat_session_id;

-- Add the foreign key constraint back with the new name
ALTER TABLE chat_messages
ADD CONSTRAINT chat_messages_chat_session_id_fkey
FOREIGN KEY (chat_session_id) REFERENCES chat_sessions(id) ON DELETE CASCADE;

-- You may also need to rename sequence generators if they exist
-- Only needed if using serial columns instead of UUID
ALTER SEQUENCE IF EXISTS messages_id_seq RENAME TO chat_messages_id_seq;
ALTER SEQUENCE IF EXISTS conversations_id_seq RENAME TO chat_sessions_id_seq;

-- Update any indexes that might reference the old table names
ALTER INDEX IF EXISTS messages_pkey RENAME TO chat_messages_pkey;
ALTER INDEX IF EXISTS conversations_pkey RENAME TO chat_sessions_pkey;

-- Updating policies to reference the new table names
ALTER POLICY "Los usuarios pueden ver mensajes de sus conversaciones"
ON chat_messages RENAME TO "Los usuarios pueden ver mensajes de sus sesiones de chat";

ALTER POLICY "Los usuarios pueden insertar mensajes en sus conversaciones"
ON chat_messages RENAME TO "Los usuarios pueden insertar mensajes en sus sesiones de chat";

-- Update policy definitions to reference new table/column names
DROP POLICY IF EXISTS "Los usuarios pueden ver mensajes de sus sesiones de chat" ON chat_messages;
CREATE POLICY "Los usuarios pueden ver mensajes de sus sesiones de chat"
  ON chat_messages FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM chat_sessions
      WHERE chat_sessions.id = chat_messages.chat_session_id
      AND chat_sessions.user_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "Los usuarios pueden insertar mensajes en sus sesiones de chat" ON chat_messages;
CREATE POLICY "Los usuarios pueden insertar mensajes en sus sesiones de chat"
  ON chat_messages FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM chat_sessions
      WHERE chat_sessions.id = chat_messages.chat_session_id
      AND chat_sessions.user_id = auth.uid()
    )
  );

-- Rename policies for chat sessions table
ALTER POLICY "Los usuarios pueden ver sus propias conversaciones"
ON chat_sessions RENAME TO "Los usuarios pueden ver sus propias sesiones de chat";

ALTER POLICY "Los usuarios pueden insertar sus propias conversaciones"
ON chat_sessions RENAME TO "Los usuarios pueden insertar sus propias sesiones de chat";

ALTER POLICY "Los usuarios pueden actualizar sus propias conversaciones"
ON chat_sessions RENAME TO "Los usuarios pueden actualizar sus propias sesiones de chat";

ALTER POLICY "Los usuarios pueden eliminar sus propias conversaciones"
ON chat_sessions RENAME TO "Los usuarios pueden eliminar sus propias sesiones de chat";
