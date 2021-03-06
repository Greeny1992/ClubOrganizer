using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using MongoDB.Entities;
using Newtonsoft.Json;
using Newtonsoft.Json.Converters;

namespace Context.DAL
{
    public class User : MongoDocument
    {
        public string UserName { get; set; }
        public string Firstname { get; set; }
        public string Lastname { get; set; }
        public string Email { get; set; }
        public bool Active { get; set; }

        public ICollection<string> MyClubs { get; set; } = new List<string>();
        public string OwnedClub { get; set; }

        [BsonIgnore]
        public string FullName
        {
            get
            {
                return Firstname + " " + Lastname;
            }
        }

        [BsonRepresentation(BsonType.String)]
        [JsonConverter(typeof(StringEnumConverter))]
        public Role Role { get; set; }

        [BsonIgnore]
        public string Password { get; set; }
        public string HashedPassword { get; set; }
        public DateTime ValidTill { get; set; }
        public ICollection<string> Groups { get; set; } = new List<string>();
    }

    public enum Role
    {
        Admin,
        User
    }

}
