import React from "react";
import { motion } from "framer-motion";
import { Building2, MapPin, ExternalLink, BadgeIndianRupee } from "lucide-react";

const CONTRACT_LABELS = {
  full_time: "Full Time",
  part_time: "Part Time",
  contract: "Contract",
  permanent: "Permanent",
};

const ChatJobCard = ({ job, index }) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: index * 0.07, duration: 0.25 }}
    className="bg-white border border-gray-100 rounded-xl p-3 shadow-sm hover:shadow-md hover:border-blue-200 transition"
  >
    <p className="text-sm font-bold text-gray-800 leading-snug line-clamp-2">{job.title}</p>
    <div className="mt-1.5 space-y-1 text-xs text-gray-500">
      <p className="flex items-center gap-1.5 truncate">
        <Building2 className="w-3.5 h-3.5 shrink-0 text-gray-400" />
        <span className="truncate">{job.company}</span>
      </p>
      <p className="flex items-center gap-1.5 truncate">
        <MapPin className="w-3.5 h-3.5 shrink-0 text-gray-400" />
        <span className="truncate">{job.location}</span>
      </p>
    </div>

    {(job.salary || job.contract) && (
      <div className="flex flex-wrap gap-1.5 mt-2">
        {job.salary && (
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100">
            <BadgeIndianRupee className="w-3 h-3" />
            {job.salary}
          </span>
        )}
        {job.contract && (
          <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-blue-50 text-[#0076BC] border border-blue-100">
            {CONTRACT_LABELS[job.contract] || job.contract}
          </span>
        )}
      </div>
    )}

    {job.applyUrl && (
      <a
        href={job.applyUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-2.5 w-full inline-flex items-center justify-center gap-1.5 text-xs font-bold py-2 rounded-lg bg-[#0076BC] text-white hover:bg-blue-700 transition"
      >
        View & Apply <ExternalLink className="w-3.5 h-3.5" />
      </a>
    )}
  </motion.div>
);

export default ChatJobCard;
