import React, { useEffect, useState, useTransition } from "react";
import Navbar from "../componets/Navbar";

import { uploadFile } from "../libs/imageKitUpload";
import Toast from "react-native-toast-message";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../store/store";
import * as FileSystem from "expo-file-system";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
} from "react-native";
import * as DocumentPicker from "expo-document-picker";
import { AntDesign, Feather } from "@expo/vector-icons";
import axios from "axios";
import Spinner from "../componets/Spinner";
import { Document, setDocuments } from "../store/dataSlice";
import Pdf from "react-native-pdf";
import * as WebBrowser from "expo-web-browser";

interface UploadedFile {
  fileName: string;
  size: number;
  type: string;
  uri: string;
}

interface DocumentField {
  id: string;
  title: string;
  subtitle: string;
  file?: UploadedFile;
}

interface DocumentSection {
  id: string;
  title: string;
  isExpanded: boolean;
  fields: DocumentField[];
  completedCount: number;
}
const DocumentScreen = () => {
  const dispatch = useDispatch();
  const [isPending, startTransition] = useTransition();
  const userInfo = useSelector((state: RootState) => state.dataSlice.userInfo);
  const [sections, setSections] = useState<DocumentSection[]>([
    {
      id: "university",
      title: "University Documents",
      isExpanded: false,
      completedCount: 0,
      fields: [
        {
          id: "transcript",
          title: "Degree Transcript",
          subtitle: "PDF of your bachelor degree",
        },
        {
          id: "cv",
          title: "Curriculum Vitae",
          subtitle: "Your updated CV/Resume",
        },
        {
          id: "language",
          title: "Language Certification",
          subtitle: "IELTS/TOEFL certificate",
        },
        {
          id: "grading",
          title: "Grading Scale Document",
          subtitle: "University grading system document",
        },
      ],
    },
    {
      id: "visa",
      title: "Visa Documents",
      isExpanded: false,
      completedCount: 0,
      fields: [
        {
          id: "admission",
          title: "Offer/Admission Letter",
          subtitle: "Official university admission letter",
        },
        {
          id: "verification",
          title: "Verification Certificate",
          subtitle: "Verified academic documents",
        },
        {
          id: "health",
          title: "Health Insurance Certificate",
          subtitle: "Valid health insurance coverage",
        },
        {
          id: "travel",
          title: "Travel Insurance Certificate",
          subtitle: "Travel insurance document",
        },
        {
          id: "sop",
          title: "SOP / LOM",
          subtitle: "Why you are going to XYZ country",
        },
      ],
    },
    {
      id: "financial",
      title: "Financial Proof",
      isExpanded: false,
      completedCount: 0,
      fields: [
        {
          id: "bank",
          title: "Bank Statement",
          subtitle: "Recent bank statement (last 3 months)",
        },
        {
          id: "blocked",
          title: "Blocked Account Statement",
          subtitle: "Blocked account certificate",
        },
      ],
    },
  ]);

  const [isOpen, setIsOpen] = useState<string | null>(null);

  const uploadDocumentsInfo = useSelector(
    (state: RootState) => state.dataSlice.document
  );

  const documentMap = new Map();

  uploadDocumentsInfo.forEach((document) => {
    const { documentTitle } = document;
    documentMap.set(documentTitle, document);
  });

  useEffect(() => {
    (async () => {
      const res = await axios.get(
        `${process.env.API_URL}/api/getDocuments?userId=${userInfo.id}`
      );
      const { documents } = res.data;
      dispatch(setDocuments(documents));
    })();
  }, []);

  useEffect(() => {
    if (!uploadDocumentsInfo || uploadDocumentsInfo.length === 0) return;

    const updatedSections = sections.map((section) => {
      const updatedFields = section.fields.map((field) => {
        if (documentMap.has(field.title)) {
          const document = documentMap.get(field.title) as Document;

          return {
            ...field,
            file: {
              fileName: document.fileName,
              uri: document.uri,
              size: document.size,
              type: "application/pdf",
            },
          };
        }
        return field;
      });

      return {
        ...section,
        completedCount: updatedFields.length,
        fields: updatedFields,
      };
    });

    setSections(updatedSections);
  }, [uploadDocumentsInfo]);

  const toggleSection = (sectionId: string) => {
    setSections((prev) =>
      prev.map((section) =>
        section.id === sectionId
          ? { ...section, isExpanded: !section.isExpanded }
          : section
      )
    );
  };

  const handleFileUpload = async (sectionId: string, fieldId: string) => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: "application/pdf",
      });

      if (result.canceled || !result.assets) return;

      const file = result.assets[0];

      if (file.size && file.size > 10 * 1024 * 1024) {
        Alert.alert("Error", "File too large. Max size is 10MB");
        return;
      }

      const uploadedFile: UploadedFile = {
        fileName: file.name,
        size: file.size ?? 0,
        type: file.mimeType ?? "application/pdf",
        uri: file.uri,
      };

      setSections((prev) =>
        prev.map((section) => {
          if (section.id === sectionId) {
            const updatedFields = section.fields.map((field) =>
              field.id === fieldId ? { ...field, file: uploadedFile } : field
            );
            const completedCount = updatedFields.filter(
              (field) => field.file
            ).length;
            return { ...section, fields: updatedFields, completedCount };
          }
          return section;
        })
      );
    } catch (error) {
      Alert.alert("Error", "File upload failed");
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const removeFile = (sectionId: string, fieldId: string) => {
    setSections((prev) =>
      prev.map((section) => {
        if (section.id === sectionId) {
          const updatedFields = section.fields.map((field) =>
            field.id === fieldId ? { ...field, file: undefined } : field
          );
          const completedCount = updatedFields.filter(
            (field) => field.file
          ).length;
          return { ...section, fields: updatedFields, completedCount };
        }
        return section;
      })
    );
  };

  // Finally uploading all pdf to database
  const uploadFiles = () => {
    try {
      const uploadDocuments = sections
        .map((section: DocumentSection) => {
          return section.fields.map((field: DocumentField) => {
            return {
              ...field.file,
              documentTitle: field.title,
            };
          });
        })
        .flat();

      startTransition(() => {
        (async () => {
          try {
            const responses = await Promise.all(
              uploadDocuments.map(async (document) => {
                try {
                  const uploadedFileUri = await uploadFileToImagekit(
                    document.uri as string,
                    document.fileName as string
                  );

                  const res = await axios.post(
                    `${process.env.API_URL}/api/uploadDocument`,
                    {
                      fileName: document.fileName,
                      size: document.size,
                      uri: uploadedFileUri,
                      documentTitle: document.documentTitle,
                      userId: userInfo.id,
                    }
                  );

                  return res.data.success === true;
                } catch (err) {
                  console.error("Upload failed for", document.fileName, err);
                  return false;
                }
              })
            );

            const allSuccessful = responses.every((success) => success);

            if (allSuccessful) {
              Toast.show({
                type: "success",
                text1: "All documents uploaded successfully!",
              });
            } else {
              Toast.show({
                type: "error",
                text1:
                  "Issue while uploading documents. Please try again later.",
              });
            }
          } catch (err) {
            console.error("Error during document upload process:", err);
            Toast.show({
              type: "error",
              text1: "Unexpected error occurred.",
            });
          }
        })();
      });
    } catch (err) {
      console.error("Unexpected outer error in uploadFiles:", err);
      Toast.show({
        type: "error",
        text1: "Something went wrong.",
      });
    }
  };

  async function uploadFileToImagekit(fileUri: string, fileName: string) {
    try {
      // Read the file as base64
      const base64 = await FileSystem.readAsStringAsync(fileUri, {
        encoding: FileSystem.EncodingType.Base64,
      });

      const uploadedFile = await uploadFile(base64, fileName);

      console.log("Uploaded URL:", uploadedFile.url);
      return uploadedFile.url;
    } catch (err) {
      console.error("Upload failed:", err);
    }
  }

  const openPDF = async () => {
    await WebBrowser.openBrowserAsync(
      "https://ik.imagekit.io/fcuhugcgk/Murli_Soft_Ys9bgnBK1y.pdf"
    );
  };

  const totalFields = sections.reduce((acc, s) => acc + s.fields.length, 0);
  const totalCompleted = sections.reduce((acc, s) => acc + s.completedCount, 0);
  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.header}>Upload Documents</Text>
        <Text style={styles.subText}>
          {uploadDocumentsInfo.length === 0
            ? totalCompleted
            : uploadDocumentsInfo.length}
          /{totalFields} completed
        </Text>

        {sections.map((section) => (
          <View key={section.id} style={styles.sectionCard}>
            <TouchableOpacity
              onPress={() => toggleSection(section.id)}
              style={styles.sectionHeader}
            >
              <View style={{ flex: 1 }}>
                <Text style={styles.sectionTitle}>{section.title}</Text>
                <Text style={styles.sectionProgress}>
                  {section.completedCount}/{section.fields.length} completed
                </Text>
              </View>
              <Feather
                name="chevron-down"
                size={20}
                color="#FF6F00"
                style={{ marginRight: 10 }}
              />
              {section.completedCount === section.fields.length &&
                section.completedCount > 0 && (
                  <AntDesign name="checkcircle" size={20} color="green" />
                )}
            </TouchableOpacity>

            {section.isExpanded && (
              <View style={styles.fieldsContainer}>
                {section.fields.map((field) => (
                  <View key={field.id} style={styles.fieldItem}>
                    <Text style={styles.fieldTitle}>{field.title}</Text>
                    <Text style={styles.fieldSubtitle}>{field.subtitle}</Text>
                    <Text style={styles.fieldHint}>PDF only • Max 10MB</Text>

                    {field.file ? (
                      <View style={styles.uploadedBox}>
                        <Text style={styles.uploadedText}>
                          {field.file.fileName}
                        </Text>
                        <Text style={styles.uploadedSize}>
                          {formatFileSize(field.file.size)}
                        </Text>
                        {field.file.uri && uploadDocumentsInfo.length > 0 ? (
                          <TouchableOpacity onPress={openPDF}>
                            <Text style={styles.uploadedText}>Open</Text>
                          </TouchableOpacity>
                        ) : (
                          <TouchableOpacity
                            onPress={() => removeFile(section.id, field.id)}
                          >
                            <AntDesign
                              name="closecircle"
                              size={20}
                              color="red"
                            />
                          </TouchableOpacity>
                        )}
                      </View>
                    ) : (
                      <TouchableOpacity
                        onPress={() => handleFileUpload(section.id, field.id)}
                        style={styles.uploadBox}
                      >
                        <Feather name="upload" size={24} color="#FF6F00" />
                        <Text style={styles.uploadText}>Upload PDF</Text>
                      </TouchableOpacity>
                    )}
                  </View>
                ))}
              </View>
            )}
          </View>
        ))}

        {uploadDocumentsInfo.length === 0 && (
          <TouchableOpacity
            disabled={totalCompleted === 0}
            style={[
              styles.submitButton,
              totalCompleted === 0 && { opacity: 0.6 },
            ]}
            onPress={() => {
              if (totalCompleted === 0) return;
              uploadFiles();
            }}
          >
            <Text style={styles.submitText}>
              {isPending && <Spinner />}
              {totalCompleted === totalFields
                ? "Submit Documents"
                : "Save & Continue"}
            </Text>
          </TouchableOpacity>
        )}
      </ScrollView>
      {/* Bottom Navigation */}
      <Navbar />
    </View>
  );
};

export default DocumentScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fcf9f8",
    marginTop: 50,
    padding: 25,
  },
  content: {
    paddingBottom: 20,
  },
  header: { fontSize: 24, fontWeight: "bold", color: "#333" },
  subText: { color: "gray", marginBottom: 16 },
  sectionCard: {
    borderWidth: 1,
    borderColor: "#eee",
    borderRadius: 10,
    marginBottom: 16,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderColor: "#eee",
  },
  sectionTitle: { fontSize: 16, fontWeight: "bold", color: "#333" },
  sectionProgress: { fontSize: 12, color: "gray" },
  fieldsContainer: { padding: 12 },
  fieldItem: { marginBottom: 16 },
  fieldTitle: { fontWeight: "bold", fontSize: 14, color: "#222" },
  fieldSubtitle: { fontSize: 12, color: "gray" },
  fieldHint: { fontSize: 10, color: "#999" },
  uploadBox: {
    marginTop: 10,
    padding: 12,
    borderWidth: 1,
    borderColor: "#FF6F00",
    borderRadius: 8,
    alignItems: "center",
    flexDirection: "row",
    gap: 8,
  },
  uploadText: { color: "#FF6F00", fontWeight: "bold" },
  uploadedBox: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#e7f9e7",
    padding: 10,
    borderRadius: 8,
    marginTop: 10,
  },
  uploadedText: { color: "#2e7d32", fontWeight: "bold" },
  uploadedSize: { color: "#4caf50", fontSize: 12 },
  submitButton: {
    backgroundColor: "#FF6F00",
    padding: 16,
    borderRadius: 10,
    marginTop: 370,
    alignItems: "center",
  },
  submitText: { color: "white", fontWeight: "bold", fontSize: 16 },
});
