SELECT AttachmentNo as id,
  IS_HDL as imageId,
  FileName as name
FROM W2Attachment
WHERE EmailNo = @id
