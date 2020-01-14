SELECT
  DocNo AS id,
  ContactNo AS contactId,
  UserID AS userId,
  DocDesc AS description,
  DocCategory AS category,
  DocDate AS date,
  DirectionFg AS direction,
  DocSource AS type,
  FileHandle AS imageId,
  ReceivedDate AS receivedDate,
  FileExtension AS extension,
  Title AS title,
  FileName AS name
FROM
  CCDocument
WHERE
    DocNo = @id;