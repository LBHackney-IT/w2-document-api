SELECT
  IS_HDL as imageId,
  Subject as subject,
  EmailFrom as sender,
  EmailTO as recipient,
  CC as cc,
  SentDate as date,
  IncomingOutgoingFlag as direction
FROM W2Email
WHERE EmailNo = @id