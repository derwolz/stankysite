-- Create the email_subscribers table (init.sql)
CREATE TABLE email_subscribers (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE NOT NULL,
    status TEXT CHECK(status IN ('active', 'unsubscribed', 'bounced', 'pending')) DEFAULT 'pending',
    source TEXT,  -- Track where the subscription came from
    subscribed_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    ip_address TEXT,  -- Store subscriber's IP for compliance
    consent_data TEXT -- Store consent-related information as JSON
);

-- Create trigger to update the updated_at timestamp
CREATE TRIGGER update_email_subscribers_timestamp 
AFTER UPDATE ON email_subscribers
BEGIN
    UPDATE email_subscribers SET updated_at = CURRENT_TIMESTAMP 
    WHERE id = NEW.id;
END;

-- Optional: Create a table for tracking email campaigns
CREATE TABLE email_campaigns (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    subject TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Optional: Create a table for tracking email interactions
CREATE TABLE email_interactions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    subscriber_id INTEGER NOT NULL,
    campaign_id INTEGER,
    interaction_type TEXT CHECK(interaction_type IN ('open', 'click', 'bounce', 'unsubscribe')),
    occurred_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(subscriber_id) REFERENCES email_subscribers(id),
    FOREIGN KEY(campaign_id) REFERENCES email_campaigns(id)
);

-- Create indexes for better query performance
CREATE INDEX idx_email_subscribers_email ON email_subscribers(email);
CREATE INDEX idx_email_subscribers_status ON email_subscribers(status);
CREATE INDEX idx_email_interactions_subscriber ON email_interactions(subscriber_id);
