using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace Context.DAL
{
    public class User : MongoDocument
    {
        public string UserName { get; set; }
        public string Firstname { get; set; }
        public string Lastname { get; set; }

        [BsonIgnore]
        public string FullName
        {
            get
            {
                return Firstname + " " + Lastname;
            }
        }

        [BsonRepresentation(BsonType.String)]
        public Role Role { get; set; }

        [BsonIgnore]
        public string Password { get; set; }
        public string HashedPassword { get; set; }
        public DateTime ValidTill { get; set; }

    }

    public enum Role
    {
        Admin,
        User
    }

}
