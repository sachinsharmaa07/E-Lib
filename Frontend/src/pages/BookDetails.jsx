import { useParams } from "react-router-dom";
import SectionWrapper from "../components/SectionWrapper.jsx";

export default function BookDetails() {
  const { id } = useParams();

  return (
    <div className="page">
      <SectionWrapper>
        <h2>Book Details</h2>
        <p>ID: {id}</p>
      </SectionWrapper>
    </div>
  );
}
