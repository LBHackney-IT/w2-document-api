USE uhwlive;

CREATE TABLE [CCDocument] (
    [BenPersonReference] int,
    [ContactNo] int,
    [DocCategory] char(255),
    [DocDate] datetime NOT NULL,
    [DocDesc] char(100),
    [FileHandle] int,
    [ProcessNo] int,
    [RefType] char(40),
    [TypeCode] char(50),
    [UserID] char(20) NOT NULL,
);

insert into CCDocument (
    BenPersonReference, ContactNo, DocCategory, DocDate, DocDesc, FileHandle, ProcessNo, RefType, TypeCode, UserId
) values (
    0, 123456, 'ASB/ASB/ASB Documents', '2010-02-03 20:30:14.000', 'ASB Interview Appointment - Complainant', 11111111, 1234, 'ASBCase', 'ASINAP-C', 'First.Last'
);

---------------------

USE cmData;

CREATE TABLE [CCDocument] (
    [BenPersonReference] int,
    [ContactNo] int,
    [DocCategory] char(255),
    [DocDate] datetime NOT NULL,
    [DocDesc] char(100),
    [FileHandle] int,
    [ProcessNo] int,
    [RefType] char(40),
    [TypeCode] char(50),
    [UserID] char(20) NOT NULL,
);

insert into CCDocument (
    BenPersonReference, ContactNo, DocCategory, DocDate, DocDesc, FileHandle, ProcessNo, RefType, TypeCode, UserId
) values (
    123456, 0, 'ASB/ASB/ASB Documents', '2010-02-03 20:30:14.000', 'I am a document from hncomino-ct', 11111111, 1234, 'ASBCase', 'ASINAP-C', 'First.Last'
);

insert into CCDocument (
    BenPersonReference, ContactNo, DocCategory, DocDate, DocDesc, FileHandle, ProcessNo, RefType, TypeCode, UserId
) values (
    654321, 0, 'ASB/ASB/ASB Documents', '2010-02-03 20:30:14.000', 'I am a document from hncomino-hb', 11111111, 1234, 'ASBCase', 'ASINAP-C', 'First.Last'
);

CREATE TABLE [BENCLAIM] (
    [PERSONREFERENCE] int,
    [CLAIMREFERENCE] char(16),
    [CTREFERENCE] char(16)
);

insert into BENCLAIM (
    PERSONREFERENCE, CLAIMREFERENCE, CTREFERENCE
) values (
    123456, 'claim_ref_1', 'ct_ref_1'
);

insert into BENCLAIM (
    PERSONREFERENCE, CLAIMREFERENCE, CTREFERENCE
) values (
    654321, 'claim_ref_2', 'ct_ref_2'
);

---------------------
