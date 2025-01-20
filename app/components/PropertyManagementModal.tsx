import React, { useState, useEffect } from "react";
import { Search, Edit, Trash2, Plus, Save, X } from "lucide-react";

// Property interface
interface Property {
  id: number;
  City: string;
  Community: string;
  Subcommunity: string;
  Property: string;
}

interface PropertyManagementModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const PropertyManagementModal: React.FC<PropertyManagementModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [editingProperty, setEditingProperty] = useState<Property | null>(null);
  const [newProperty, setNewProperty] = useState<Property>({
    id: 0,
    City: "",
    Community: "",
    Subcommunity: "",
    Property: "",
  });
  const [error, setError] = useState<string | null>(null);

  // Load properties from local JSON file
  const loadProperties = async () => {
    try {
      const response = await fetch("/properties.json");
      if (!response.ok) {
        throw new Error("Failed to fetch properties");
      }
      const data = await response.json();
      setProperties(data);
    } catch (err) {
      setError("Failed to load properties");
      console.error(err);
    }
  };

  // Save properties to local JSON file
  const saveProperties = async (updatedProperties: Property[]) => {
    try {
      const response = await fetch("/api/save-properties", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedProperties),
      });

      if (!response.ok) {
        throw new Error("Failed to save properties");
      }

      setProperties(updatedProperties);
    } catch (err) {
      setError("Failed to save properties");
      console.error(err);
    }
  };

  // Effect to load properties when modal opens
  useEffect(() => {
    if (isOpen) {
      loadProperties();
    }
  }, [isOpen]);

  // Filter properties based on search query
  const filteredProperties = properties.filter((prop) =>
    Object.values(prop).some((value) =>
      value.toString().toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  // Add new property
  const addProperty = async () => {
    // Validate city is not empty
    if (!newProperty.City.trim()) {
      setError("City cannot be empty");
      return;
    }

    // Generate a new ID (use max ID + 1)
    const newId =
      properties.length > 0 ? Math.max(...properties.map((p) => p.id)) + 1 : 1;

    const propertyToAdd = {
      ...newProperty,
      id: newId,
    };

    const updatedProperties = [...properties, propertyToAdd];
    await saveProperties(updatedProperties);

    // Reset new property form
    setNewProperty({
      id: 0,
      City: "",
      Community: "",
      Subcommunity: "",
      Property: "",
    });
  };

  // Update existing property
  const updateProperty = async () => {
    if (!editingProperty) return;

    // Validate city is not empty
    if (!editingProperty.City.trim()) {
      setError("City cannot be empty");
      return;
    }

    const updatedProperties = properties.map((p) =>
      p.id === editingProperty.id ? editingProperty : p
    );

    await saveProperties(updatedProperties);

    // Clear editing state
    setEditingProperty(null);
  };

  // Delete property
  const deleteProperty = async (propertyToDelete: Property) => {
    const updatedProperties = properties.filter(
      (p) => p.id !== propertyToDelete.id
    );
    await saveProperties(updatedProperties);
  };

  // Render loading and error states
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg p-6 w-11/12 max-w-4xl max-h-[90vh] overflow-auto">
        {/* Error Handling */}
        {error && (
          <div
            className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4"
            role="alert"
          >
            <span className="block sm:inline">{error}</span>
            <button
              onClick={() => setError(null)}
              className="absolute top-0 bottom-0 right-0 px-4 py-3"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
        )}

        {/* Modal Header */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Property Management</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X size={24} />
          </button>
        </div>

        {/* Search Bar */}
        <div className="mb-4 flex items-center">
          <Search className="text-gray-400 mr-2" />
          <input
            type="text"
            placeholder="Search properties..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full p-2 border rounded"
          />
        </div>

        {/* Add New Property Section */}
        <div className="mb-4 grid grid-cols-4 gap-2 bg-gray-100 p-3 rounded">
          <input
            placeholder="City*"
            value={newProperty.City}
            onChange={(e) =>
              setNewProperty({ ...newProperty, City: e.target.value })
            }
            className="p-2 border rounded"
            required
          />
          <input
            placeholder="Community"
            value={newProperty.Community}
            onChange={(e) =>
              setNewProperty({ ...newProperty, Community: e.target.value })
            }
            className="p-2 border rounded"
          />
          <input
            placeholder="Subcommunity"
            value={newProperty.Subcommunity}
            onChange={(e) =>
              setNewProperty({ ...newProperty, Subcommunity: e.target.value })
            }
            className="p-2 border rounded"
          />
          <input
            placeholder="Property"
            value={newProperty.Property}
            onChange={(e) =>
              setNewProperty({ ...newProperty, Property: e.target.value })
            }
            className="p-2 border rounded"
          />
          <button
            onClick={addProperty}
            className="col-span-4 bg-green-500 text-white p-2 rounded flex items-center justify-center hover:bg-green-600"
          >
            <Plus className="mr-2" /> Add New Property
          </button>
        </div>

        {/* Properties Table */}
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-200">
              <th className="p-2 border">ID</th>
              <th className="p-2 border">City</th>
              <th className="p-2 border">Community</th>
              <th className="p-2 border">Subcommunity</th>
              <th className="p-2 border">Property</th>
              <th className="p-2 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredProperties.map((property) => (
              <tr key={property.id} className="hover:bg-gray-50">
                {editingProperty?.id === property.id ? (
                  // Editing Row
                  <>
                    <td className="p-2 border">{property.id}</td>
                    <td>
                      <input
                        value={editingProperty.City}
                        onChange={(e) =>
                          setEditingProperty({
                            ...editingProperty,
                            City: e.target.value,
                          })
                        }
                        className="w-full p-1 border"
                        required
                      />
                    </td>
                    <td>
                      <input
                        value={editingProperty.Community}
                        onChange={(e) =>
                          setEditingProperty({
                            ...editingProperty,
                            Community: e.target.value,
                          })
                        }
                        className="w-full p-1 border"
                      />
                    </td>
                    <td>
                      <input
                        value={editingProperty.Subcommunity}
                        onChange={(e) =>
                          setEditingProperty({
                            ...editingProperty,
                            Subcommunity: e.target.value,
                          })
                        }
                        className="w-full p-1 border"
                      />
                    </td>
                    <td>
                      <input
                        value={editingProperty.Property}
                        onChange={(e) =>
                          setEditingProperty({
                            ...editingProperty,
                            Property: e.target.value,
                          })
                        }
                        className="w-full p-1 border"
                      />
                    </td>
                    <td className="p-2 border flex space-x-2">
                      <button
                        onClick={updateProperty}
                        className="text-green-500 hover:text-green-700"
                      >
                        <Save />
                      </button>
                      <button
                        onClick={() => setEditingProperty(null)}
                        className="text-gray-500 hover:text-gray-700"
                      >
                        <X />
                      </button>
                    </td>
                  </>
                ) : (
                  // Display Row
                  <>
                    <td className="p-2 border">{property.id}</td>
                    <td className="p-2 border">{property.City}</td>
                    <td className="p-2 border">{property.Community}</td>
                    <td className="p-2 border">{property.Subcommunity}</td>
                    <td className="p-2 border">{property.Property}</td>
                    <td className="p-2 border flex space-x-2">
                      <button
                        onClick={() => setEditingProperty(property)}
                        className="text-blue-500 hover:text-blue-700"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        onClick={() => deleteProperty(property)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PropertyManagementModal;
